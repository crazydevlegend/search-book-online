import { useEffect, useState } from "react";
import {
  Container,
  Content,
  FlexboxGrid,
  Header,
  Input,
  Loader,
  Nav,
  Navbar,
  Panel,
  Placeholder,
  Table,
} from "rsuite";
const { HeaderCell, Cell, Column } = Table;
import HomeIcon from "@rsuite/icons/legacy/Home";
import useSWR from "swr";

enum Type {
  Work = "work",
}
enum EbookAccess {
  Borrowable = "borrowable",
  NoEbook = "no_ebook",
  Printdisabled = "printdisabled",
  Public = "public",
}
type Doc = {
  key?: string;
  type?: Type;
  seed?: string[];
  title?: string;
  title_suggest?: string;
  edition_count?: number;
  edition_key?: string[];
  publish_date?: string[];
  publish_year?: number[];
  first_publish_year?: number;
  isbn?: string[];
  last_modified_i?: number;
  ebook_count_i?: number;
  ebook_access?: EbookAccess;
  has_fulltext?: boolean;
  public_scan_b?: boolean;
  publisher?: string[];
  language?: string[];
  author_key?: string[];
  author_name?: string[];
  publisher_facet?: string[];
  _version_?: number;
  author_facet?: string[];
  number_of_pages_median?: number;
  cover_edition_key?: string;
  cover_i?: number;
  lccn?: string[];
  publish_place?: string[];
  lcc?: string[];
  ddc?: string[];
  ia?: string[];
  ia_collection_s?: string;
  lending_edition_s?: string;
  lending_identifier_s?: string;
  printdisabled_s?: string;
  subject?: string[];
  id_goodreads?: string[];
  id_librarything?: string[];
  ia_box_id?: string[];
  subject_facet?: string[];
  lcc_sort?: string;
  subject_key?: string[];
  ddc_sort?: string;
  oclc?: string[];
  author_alternative_name?: string[];
  ia_collection?: string[];
  contributor?: string[];
  subtitle?: string;
  person?: string[];
  place?: string[];
  id_amazon?: string[];
  id_overdrive?: string[];
  person_key?: string[];
  place_key?: string[];
  person_facet?: string[];
  place_facet?: string[];
  first_sentence?: string[];
  ia_loaded_id?: string[];
  time?: string[];
  time_facet?: string[];
  time_key?: string[];
  id_alibris_id?: string[];
  id_better_world_books?: string[];
  id_google?: string[];
  id_hathi_trust?: string[];
  id_isfdb?: string[];
  id_librivox?: string[];
  id_project_gutenberg?: string[];
  id_standard_ebooks?: string[];
};
type Result = {
  numFound?: number;
  start?: number;
  numFoundExact?: boolean;
  docs?: Doc[];
  num_found?: number;
  q?: string;
  offset?: null;
};
type RowData = {
  title?: string;
  author_name?: string /*[]*/;
  first_publish_year?: number;
  isbn?: /*string[]*/ string;
  number_of_pages_median?: number;
};

const CenterLoader = () => (
  <div>
    <Placeholder.Paragraph rows={8} />
    <Loader center content="loading" />
  </div>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tableData, setTableData] = useState<Array<RowData>>([]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error } = useSWR(
    `https://openlibrary.org/search.json?q=${searchQuery.replaceAll(" ", "+")}`,
    fetcher
  );

  useEffect(() => {
    if (error) return;
    console.log("--------------------------------");

    const docs: Array<Doc> = data?.docs;
    const filteredDocs: Array<RowData> = docs?.map((doc) => ({
      author_name: doc.author_name?.join("\r\n"),
      first_publish_year: doc.first_publish_year,
      isbn: doc.isbn?.join("\r\n"),
      number_of_pages_median: doc.number_of_pages_median,
      title: doc.title,
    }));
    console.log(data);
    console.log(filteredDocs);
    setTableData(filteredDocs);
    console.log("--------------------------------");
  }, [data]);

  return (
    <Container className="flex space-y-4">
      <Header>
        <Navbar appearance="inverse">
          <Nav className="font-bold">
            <Nav.Item icon={<HomeIcon />}>Search Book</Nav.Item>
          </Nav>
          <Nav className="flex text-xl space-x-8 p-4" pullRight>
            <p className="underline">
              Robert Carden - senoir blockchain | full-stack developer
            </p>
            <a href="https://t.me/crazydevlegned">Telegram</a>
            <a href="mailto:crazydevlegend@gmail.com">Gmail</a>
            <a href="https://crazydevlegend.netlify.app">Portfolio</a>
          </Nav>
        </Navbar>
      </Header>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={20}>
            <Panel
              header={
                <Input
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Type book title here..."
                ></Input>
              }
              bordered
              bodyFill
            >
              {isLoading && <CenterLoader />}
              {!isLoading && (
                <Table height={500} data={tableData}>
                  <Column width={300} align="center" fixed>
                    <HeaderCell>Title</HeaderCell>
                    <Cell dataKey="title" />
                  </Column>

                  <Column width={200} fixed>
                    <HeaderCell>Author</HeaderCell>
                    <Cell dataKey="author_name" />
                  </Column>

                  <Column width={100}>
                    <HeaderCell>First Published At</HeaderCell>
                    <Cell dataKey="first_publish_year" />
                  </Column>

                  <Column width={300}>
                    <HeaderCell>ISBN</HeaderCell>
                    <Cell dataKey="isbn" />
                  </Column>

                  <Column width={300}>
                    <HeaderCell>Pages</HeaderCell>
                    <Cell dataKey="number_of_pages_median" />
                  </Column>
                </Table>
              )}
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  );
}
