export type BlogFormType = {
    title: string;
    description: string;
    content: string;
    slug: string;
    image?: string;
    keywords?: string[];
};

export type LoginFormType = {
    username: string;
    password: string;
};

export type SignupFormType = {
    username: string;
    email: string;
    password: string;
};