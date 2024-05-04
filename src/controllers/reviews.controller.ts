import { Request, Response } from "express";
import Reviews from "../models/reviews";
import { UserData } from "./otpauth.controllers";
import Product from "../models/Product";
import { reviewData } from "../types/reviews";

export const productReview = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserData;
    const { productId } = req.params;
    const { feedback, rating } = req.body;

    const reviewed = (await Reviews.findOne({
      where: {
        productId,
        buyerId: user.dataValues.id
      }
    })) as reviewData;

    if (reviewed) {
      const updateReview = await Reviews.update(
        {
          rating,
          feedback
        },
        { returning: true, where: { id: reviewed.dataValues.id } }
      );

      return res.status(200).json({
        message: "Review update successfully",
        review: updateReview[1]
      });
    }
    const saveReview = await Reviews.create({
      productId,
      buyerId: user.dataValues.id,
      rating,
      feedback
    });
    res.status(200).json({
      message: "Review sent successfully",
      review: saveReview
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
