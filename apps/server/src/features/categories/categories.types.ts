export interface CreateCategoryInput {
    name: string;
    slug: string;
    icon?: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
}

export interface CategoryTree {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    sortOrder: number;
    children: CategoryTree[];
}