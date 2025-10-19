import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Blog - AssignmentGhar",
  description: "Tips and guides for academic success.",
};

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "How to Write a Compelling Report",
      excerpt:
        "Learn the essential steps to structure and write a professional academic report.",
      category: "Writing Tips",
      date: "Oct 15, 2025",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Best Referencing Styles Explained",
      excerpt:
        "A comprehensive guide to Harvard, APA, and Chicago referencing styles.",
      category: "Academic Standards",
      date: "Oct 12, 2025",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Time Management for Students",
      excerpt:
        "Practical strategies to manage your workload and meet deadlines effectively.",
      category: "Study Tips",
      date: "Oct 10, 2025",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "Research Skills for Success",
      excerpt:
        "Master the art of finding and evaluating credible academic sources.",
      category: "Research",
      date: "Oct 8, 2025",
      readTime: "8 min read",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Student Success Blog
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Tips, guides, and insights to help you succeed in your academic
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex-1">
                  <Badge variant="default" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-2 text-emerald-900 dark:text-emerald-100">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-emerald-800 dark:text-emerald-200 mb-6">
              Get weekly tips and updates delivered to your inbox.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 border border-emerald-300 dark:border-emerald-700 rounded-lg bg-white dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 placeholder-emerald-600 dark:placeholder-emerald-400"
              />
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
