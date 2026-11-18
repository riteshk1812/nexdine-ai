import {
  RestaurantModel,
  type Restaurant,
} from "../models/restaurant.model.js";

import type { QueryFilter } from "mongoose";

import type {
  CreateRestaurantInput,
  ListRestaurantsQuery,
} from "../validators/restaurant.validator.js";

type RestaurantCreateData = Omit<CreateRestaurantInput, "coordinates"> & {
  slug: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
};

export const restaurantRepository = {
  create: async (data: RestaurantCreateData) => {
    return RestaurantModel.create(data);
  },

  findById: async (id: string) => {
    return RestaurantModel.findById(id).exec();
  },

  findMany: async (filters: ListRestaurantsQuery) => {
    const query: QueryFilter<Restaurant> = {};

    if (filters.city) {
      query["address.city"] = new RegExp(filters.city, "i");
    }

    if (filters.cuisine) {
      query.cuisines = filters.cuisine;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.isAcceptingOrders !== undefined) {
      query.isAcceptingOrders = filters.isAcceptingOrders;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [restaurants, total] = await Promise.all([
      RestaurantModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(filters.limit)
        .exec(),

      RestaurantModel.countDocuments(query).exec(),
    ]);

    return {
      restaurants,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  },

  findNearby: async (filters: {
    longitude: number;
    latitude: number;
    maxDistanceMeters: number;
    cuisine?: string;
    page: number;
    limit: number;
  }) => {
    const skip = (filters.page - 1) * filters.limit;

    const geoQuery = {
      status: "ACTIVE",
      isAcceptingOrders: true,
      ...(filters.cuisine && {
        cuisines: filters.cuisine,
      }),
    };

    const [result] = await RestaurantModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [filters.longitude, filters.latitude],
          },

          distanceField: "distanceMeters",
          maxDistance: filters.maxDistanceMeters,
          spherical: true,
          query: geoQuery,
        },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: filters.limit }],

          metadata: [{ $count: "total" }],
        },
      },
    ]).exec();

    const restaurants = result?.data ?? [];
    const total = result?.metadata?.[0]?.total ?? 0;

    return {
      restaurants,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  },

  updateById: async (id: string, data: Partial<Restaurant>) => {
    return RestaurantModel.findByIdAndUpdate(
      id,
      { $set: data },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).exec();
  },
};
