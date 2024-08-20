import {
    createBrowserRouter,
} from "react-router-dom";
import Files from "./pages/files/file";

const router = createBrowserRouter(
    [
        {
            path: "files",
            element: <Files />,
        },
        {
            path: "*",
            element: <Files />,
        }
    ]
)

export default router;