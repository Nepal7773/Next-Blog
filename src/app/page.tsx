import BlogList from "@/components/BlogList";

export default function Home() {
  return (
    <>
      <main className="p-3 md:p-6">
        <h1 className="text-3xl text-center">Latest Blogs</h1>
        <div className="w-16 h-2 mx-auto rounded-md my-2 bg-emerald-400"></div>
        <BlogList />
      </main>
    </>
  );
}
