import { Helmet, HelmetProvider } from "react-helmet-async";

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>GuideBeeLK - Guider</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <Helmet defaultTitle="GuideBeeLK - Guider" />
    {children}
  </HelmetProvider>
);

export default PageMeta;
