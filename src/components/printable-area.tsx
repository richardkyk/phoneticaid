import { Document, Font, Page, Text, View } from "@react-pdf/renderer";
import { useDocumentStore } from "~/lib/store";

const getEnvFontPath = (font: string) => {
  if (typeof window === "undefined") {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const path = require("path");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return path.resolve(__dirname, `../fonts/${font}.ttf`);
  }

  return `./${font}.ttf`;
};

// Register font
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
Font.register({ family: "KaiTi", src: getEnvFontPath("KaiTi2") });
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
Font.register({ family: "inter", src: getEnvFontPath("Inter-Regular") });

// Create Document Component
export default function PrintableArea() {
  console.log("rendering pdf");

  const rowCount = useDocumentStore.getState().config.rowCount;
  const columnCount = useDocumentStore.getState().config.columnCount;
  const mainTextSize = useDocumentStore.getState().config.mainTextSize;
  const secondaryTextSize =
    useDocumentStore.getState().config.secondaryTextSize;
  const offset = useDocumentStore.getState().config.offset;
  const rowGap = useDocumentStore.getState().config.rowGap;
  const columnGap = useDocumentStore.getState().config.columnGap;

  const content = useDocumentStore.getState().content;
  return (
    <Document>
      <Page
        size="A4"
        style={{
          flexDirection: "column",
          gap: rowGap,
          marginTop: 40,
          paddingHorizontal: 20,
        }}
        debug={true}
      >
        {Array(rowCount)
          .fill(0)
          .map((_, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                gap: columnGap,
              }}
            >
              {Array(columnCount)
                .fill(0)
                .map((_, j) => (
                  <View
                    key={j}
                    style={{ flexDirection: "column", gap: rowGap }}
                  >
                    <View
                      key={j}
                      style={{
                        position: "absolute",
                        top: offset,
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: secondaryTextSize,
                          fontFamily: "inter",
                        }}
                      >
                        {content.get(`${i}:${j}`)?.pinyin}
                      </Text>
                    </View>
                    <Text
                      key={j}
                      style={{ fontSize: mainTextSize, fontFamily: "KaiTi" }}
                    >
                      {content.get(`${i}:${j}`)?.value}
                    </Text>
                  </View>
                ))}
            </View>
          ))}
      </Page>
    </Document>
  );
}
