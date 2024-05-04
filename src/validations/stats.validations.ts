import { NextFunction, Request, Response } from "express";

export const validateStats = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const start = req.query.start as any;
    const end = req.query.end as any;
    const startStr = String(start).trim();
    const endStr = String(end).trim();

    if (!startStr || !endStr) {
      return res
        .status(400)
        .json({ error: "Both start and end dates are required" });
    }
    const dateFormat = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    if (!dateFormat.test(startStr) || !dateFormat.test(endStr)) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Please use YYYY-MM-DD format" });
    }
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    if (startDate > endDate) {
      return res
        .status(400)
        .json({ error: "Start date cannot be greater than end date" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
