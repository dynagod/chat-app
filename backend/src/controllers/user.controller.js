import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req, res) => {
    const data = [
        {
          id: 1,
          title: "The Great Gatsby",
          genre: "Novel"
        },
        {
          id: 2,
          title: "1984",
          genre: "Dystopian"
        },
        {
          id: 3,
          title: "To Kill a Mockingbird",
          genre: "Fiction"
        },
        {
          id: 4,
          title: "Moby-Dick",
          genre: "Adventure"
        },
        {
          id: 5,
          title: "Pride and Prejudice",
          genre: "Romance"
        }
    ];      

    res.status(200).json(
        new ApiResponse(200, data, "Data fetched successfully")
    );
});

export { registerUser };