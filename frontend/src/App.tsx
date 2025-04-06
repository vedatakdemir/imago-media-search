import {
  ClearOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Col,
  Empty,
  Grid,
  Input,
  Layout,
  Pagination,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import MediaCard from "../components/MediaCard/MediaCard";
import styles from "./App.module.css";

const { Header, Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

type MediaItem = {
  title: string;
  photographer: string;
  date: string;
  imageUrl: string;
};

type SearchResponse = {
  results: MediaItem[];
  total: number;
};

function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "desc";
  const pageSize = 48;

  const { data, isLoading, isError, refetch } = useQuery<SearchResponse>({
    queryKey: ["media", query, page, sort],
    queryFn: () =>
      api
        .get(
          `?q=${query}&from=${
            (page - 1) * pageSize
          }&size=${pageSize}&sort=${sort}`
        )
        .then((res) => res.data),
  });

  const handleSearch = (value: string) => {
    navigate(
      value ? `/?q=${value}&page=1&sort=${sort}` : `/?page=1&sort=${sort}`
    );
  };

  const handlePageChange = (newPage: number) => {
    const base = query ? `/?q=${query}` : `/?`;
    navigate(`${base}&page=${newPage}&sort=${sort}`);
  };

  const handleSortChange = (value: string) => {
    const base = query ? `/?q=${query}` : `/?`;
    navigate(`${base}&page=1&sort=${value}`);
  };

  const handleClearSearch = () => {
    navigate(`/?page=1&sort=${sort}`);
  };

  const showingResultsText = () => {
    if (!data || data.total === 0) return "";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, data.total);
    return `Showing ${start}-${end} of ${data.total} results`;
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Title level={screens.md ? 3 : 4} className={styles.title}>
          <span className={styles.titleHighlight}>Media</span> Search
        </Title>
      </Header>

      <Content className={screens.md ? styles.content : styles.contentMobile}>
        <div className={styles.searchContainer}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={14} lg={16}>
              <Input.Search
                placeholder="Search for media..."
                allowClear
                size="large"
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />}>
                    Search
                  </Button>
                }
                onSearch={handleSearch}
                defaultValue={query}
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} md={10} lg={8}>
              <Space
                wrap
                className={
                  screens.md
                    ? styles.filterContainer
                    : styles.filterContainerMobile
                }
              >
                <Select
                  value={sort}
                  onChange={handleSortChange}
                  style={{ width: 160 }}
                  options={[
                    {
                      label: (
                        <Space>
                          <SortDescendingOutlined /> Newest First
                        </Space>
                      ),
                      value: "desc",
                    },
                    {
                      label: (
                        <Space>
                          <SortAscendingOutlined /> Oldest First
                        </Space>
                      ),
                      value: "asc",
                    },
                  ]}
                  suffixIcon={<FilterOutlined />}
                />
                {query && (
                  <Button icon={<ClearOutlined />} onClick={handleClearSearch}>
                    Clear
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {query && (
          <div className={styles.queryContainer}>
            <Space size="middle" align="center">
              <Badge count={query} className={styles.badge} />
              <Typography.Text type="secondary">
                {showingResultsText()}
              </Typography.Text>
            </Space>
          </div>
        )}

        {isLoading && (
          <div className={styles.loadingContainer}>
            <Spin
              spinning={true}
              fullscreen
              tip="Loading results..."
              data-testid="loading-spinner"
            />
          </div>
        )}

        {!isLoading && isError && (
          <div data-testid="error-msg">
            <Result
              status="error"
              title="Failed to load results"
              subTitle="There was an error loading the media. Please try again."
              extra={
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                >
                  Try Again
                </Button>
              }
            />
          </div>
        )}

        {!isLoading && !isError && data?.results.length === 0 && (
          <Empty
            description={
              <Typography.Text>
                {query ? `No results found for "${query}"` : "No results found"}
              </Typography.Text>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className={styles.emptyContainer}
          />
        )}

        <Row gutter={[24, 24]}>
          {data?.results.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <MediaCard {...item} />
            </Col>
          ))}
        </Row>

        {data && data?.total > 0 && (
          <div className={styles.paginationContainer}>
            <Pagination
              current={page}
              onChange={handlePageChange}
              pageSize={pageSize}
              total={data.total}
              showSizeChanger={false}
              showQuickJumper
              hideOnSinglePage
            />
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default App;
