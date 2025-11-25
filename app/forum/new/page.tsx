import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";
import NewPostForm from "@/components/Forum/NewPostForm";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      color
    }
  }
`;

export default async function NewPostPage() {
  const client = getClient();

  const { data } = await client.query({
    query: GET_CATEGORIES,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-6 md:px-12 py-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900 dark:text-white">
          发布新帖
        </h1>

        <NewPostForm categories={data.categories} />
      </div>
    </div>
  );
}
