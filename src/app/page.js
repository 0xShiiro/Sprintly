import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = auth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Sprintly</h1>
        <p className="text-xl text-gray-300 mb-8">
          Your modern project management solution built with Next.js
        </p>
        {!userId && (
          <p className="text-gray-400">
            Sign in to start managing your projects
          </p>
        )}
      </div>
    </div>
  );
}
