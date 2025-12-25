import PageMeta from "../../components/common/PageMeta";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <>
      <PageMeta title={`${title} | GuideBeeLK Admin`} description={description} />

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {description}
          </p>
          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceholderPage;