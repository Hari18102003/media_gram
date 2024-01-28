import { AddPhotoAlternateOutlined, BookmarksOutlined, FavoriteBorderOutlined, HomeOutlined, PeopleAltOutlined } from '@mui/icons-material';
export const Menu = [
    {
        id: 1,
        label: "Home",
        icon: <HomeOutlined />,
        path: "/dashboard"
    },
    {
        id: 2,
        label: "Create Post",
        icon: <AddPhotoAlternateOutlined />,
        path: "/dashboard/create-post"
    },
    {
        id: 3,
        label: "People",
        icon: <PeopleAltOutlined />,
        path: "/dashboard/people"
    },
    {
        id: 4,
        label: "Saved Posts",
        icon: <BookmarksOutlined />,
        path: "/dashboard/saved-posts"
    },
    {
        id: 5,
        label: "Liked Posts",
        icon: <FavoriteBorderOutlined />,
        path: "/dashboard/liked-posts"
    }
];