import mongoose from "mongoose";
import BookModel from "../models/book.model.js";
import { fixPath } from "../helpers/utils.js";

export const addBook = async (req, res) => {
    try {
        const files = req.files;

        if (!files.bookPdf || !files.bookFrontCover || !files.bookBackCover) {
            return res.status(400).json({
                error: "All three files (PDF, front cover, back cover) are required.",
            });
        }

        if (!req.body.title || !req.body.description) {
            return res.status(400).json({
                error: "Title, Description are required.",
            });
        }

        const bookData = {
            ownerId: req.user.id,
            bookPdfPath: fixPath(files.bookPdf[0].path),
            bookFrontCoverPath: fixPath(files.bookFrontCover[0].path),
            bookBackCoverPath: fixPath(files.bookBackCover[0].path),
            title: req.body.title,
            description: req.body.description,
            ...(req.body.isCommentVisible && {
                isCommentVisible: req.body.isCommentVisible === "true",
            }),
            ...(req.body.isForKids && {
                isForKids: req.body.isForKids === "true",
            }),
            ...(req.body.isAgeRestricted && {
                isAgeRestricted: req.body.isAgeRestricted === "true",
            }),
            ...(req.body.publishAs && { publishAs: req.body.publishAs }),
            ...(req.body.scheduleToPublishOn && {
                scheduleToPublishOn: req.body.scheduleToPublishOn,
            }),
        };

        await BookModel.create(bookData);

        return res
            .status(200)
            .json({ message: "Book added successfully", data: bookData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

export const getMyBooks = async (req, res) => {
    try {
        const books = await BookModel.aggregate([
            {
                $match: { ownerId: new mongoose.Types.ObjectId(req.user.id) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "ownerId",
                    foreignField: "_id",
                    as: "ownerDetails",
                },
            },
            {
                $unwind: "$ownerDetails", // you can also use this in $project - ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] }
            },
            {
                $lookup: {
                    from: "userlibraries",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "userLibraryDetails",
                    pipeline: [
                        {
                            $match: {
                                addedBy: new mongoose.Types.ObjectId(
                                    req.user.id
                                ),
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    isInLibrary: {
                        $gt: [{ $size: "$userLibraryDetails" }, 0],
                    },
                },
            },
            {
                $lookup: {
                    from: "booklikes",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "userLikeDetails",
                    pipeline: [
                        {
                            $match: {
                                likedBy: new mongoose.Types.ObjectId(
                                    req.user.id
                                ),
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $gt: [{ $size: "$userLikeDetails" }, 0],
                    },
                },
            },
            {
                $project: {
                    ownerId: 0,
                    __v: 0,
                    "ownerDetails.__v": 0,
                    userLibraryDetails: 0,
                    userLikeDetails: 0,
                },
            },
        ]);

        res.status(200).json({
            code: 1,
            message: "my books get successfully",
            data: books,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

export const getOthersBooks = async (req, res) => {
    try {
        const books = await BookModel.aggregate([
            {
                $match: {
                    ownerId: { $ne: new mongoose.Types.ObjectId(req.user.id) },
                    publishAs: "public",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "ownerId",
                    foreignField: "_id",
                    as: "ownerDetails",
                },
            },
            {
                $unwind: "$ownerDetails", // you can also use this in $project - ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] }
            },
            {
                $unset: "ownerDetails.__v",
            },
            {
                $project: {
                    ownerId: 0,
                    __v: 0,
                },
            },
        ]);

        // Above, You can't write ownerDetails.__v: 0 because after $unwind, ownerDetails becomes a flattened object, and MongoDB can't handle path collisions when you try to exclude fields from it using dot notation in $project.

        res.status(200).json({
            code: 1,
            message: "others books get successfully",
            data: books,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 0, message: error.message });
    }
};

export const getIndividualBook = async (req, res) => {
    let book = await BookModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req.params.bookId) },
        },
        {
            $lookup: {
                from: "users",
                localField: "ownerId",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },
        {
            $unwind: "$ownerDetails",
        },
        {
            $lookup: {
                from: "userlibraries",
                localField: "_id",
                foreignField: "bookId",
                as: "userLibraryDetails",
                pipeline: [
                    {
                        $match: {
                            addedBy: new mongoose.Types.ObjectId(req.user.id),
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "userlibraries",
                localField: "_id",
                foreignField: "bookId",
                as: "userLibraryDetails",
                pipeline: [
                    {
                        $match: {
                            addedBy: new mongoose.Types.ObjectId(req.user.id),
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                isInLibrary: {
                    $gt: [{ $size: "$userLibraryDetails" }, 0],
                },
            },
        },
        {
            $lookup: {
                from: "booklikes",
                localField: "_id",
                foreignField: "bookId",
                as: "userLikeDetails",
                pipeline: [
                    {
                        $match: {
                            likedBy: new mongoose.Types.ObjectId(req.user.id),
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                isLiked: {
                    $gt: [{ $size: "$userLikeDetails" }, 0],
                },
            },
        },
        {
            $project: {
                ownerId: 0,
                __v: 0,
                "ownerDetails.__v": 0,
                userLibraryDetails: 0,
                userLikeDetails: 0,
            },
        },
    ]);

    if (!book) {
        res.status(404).json({ message: "Book Not found" });
    }

    res.status(200).json({
        code: 1,
        message: "individual book get successfully",
        data: book[0],
    });
};
