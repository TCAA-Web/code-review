import { useQuery } from "@tanstack/react-query";
import style from "../styles/gallery.module.scss";
import { graphQLClient } from "../graphqlClient";
import { getOrderedProducts } from "../requests/getOrderedProducts";
import { Suspense, useState } from "react";
import { Modal } from "./Modal";
import { Pagination } from "./Pagination";
import { ItemType, ProductType } from "../types/types";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { useGetNumOfItems } from "../hooks/useGetNumOfItems";

export const Gallery = () => {
  const [skipCount, setSkipCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemType>({
    title: "",
    image: { url: "" },
  });

  const { arrLength } = useGetNumOfItems();

  const dataQuery: ProductType = useQuery(
    ["getOrderedProducts", skipCount],
    async () =>
      await graphQLClient.request(getOrderedProducts, { skipCount: skipCount })
  );

  const handlePrevNext = (order: string) => {
    if (order === "asc") {
      setSkipCount((prev) => (prev + 12 < arrLength ? prev + 12 : prev));
    }
    if (order === "desc") {
      setSkipCount((prev) => (prev - 12 > 0 ? prev - 12 : 0));
    }
  };

  const handleOpenModal = (item: ItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  if (dataQuery?.isInitialLoading) return <h1>Loading....</h1>;
  if (dataQuery?.error) return <h1>Something went wrong..</h1>;
  if (dataQuery?.status == "success")
    return (
      <section id="gallery">
        <h2 className={style.galleryHeading}>Galleriet</h2>
        <Suspense fallback={<ClipLoader />}>
          <div className={style.galleryWrapper}>
            <FiArrowLeftCircle onClick={() => handlePrevNext("desc")} />
            <div className={style.imageGallery}>
              {dataQuery.data?.productCollection?.items?.map(
                (item: ProductType, index: Number) => {
                  return (
                    <img
                      onClick={() => handleOpenModal(item)}
                      src={item.image.url}
                      key={item.title.toString()}
                      alt={"image:" + item.title}
                    ></img>
                  );
                }
              )}
            </div>
            <FiArrowRightCircle onClick={() => handlePrevNext("asc")} />
          </div>
        </Suspense>
        <Modal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedItem={selectedItem}
        />
        <Pagination setSkipCount={setSkipCount} skipCount={skipCount} />
      </section>
    );
};
