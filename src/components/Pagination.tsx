import { useEffect, useState } from "react";
import { graphQLClient } from "../graphqlClient";
import { useQuery } from "@tanstack/react-query";
import { getTotalItemCount } from "../requests/getTotalItemCount";
import style from "../styles/pagination.module.scss";
import { ProductCountType } from "../types/types";
import { useGetNumOfItems } from "../hooks/useGetNumOfItems";

interface PaginationInterface {
  setSkipCount: (arg: number) => void;
  skipCount: number;
}

export const Pagination = ({
  setSkipCount,
  skipCount,
}: PaginationInterface) => {
  
  const [points, setPoints] = useState<Array<{ point: number }>>([]);

  const { arrLength } = useGetNumOfItems();

  const handlePagination = (number: number) => {
    let skip_num = (number - 1) * 12;
    setSkipCount(skip_num);
  };

  useEffect(() => {
    const createPagination = () => {
      const numberOfPoints = Math.ceil(arrLength / 12);

      const pointsArray = [];

      for (let i = 0; i < numberOfPoints; i++) {
        pointsArray.push({ point: i + 1 });
      }
      setPoints(pointsArray);
    };
    createPagination();
  }, [arrLength]);

  return (
    <div className={style.pagination}>
      {points?.map((item) => {
        return (
          <span
            style={
              skipCount === (item.point - 1) * 12
                ? {
                    fontSize: "1.4rem",
                    borderRadius: "50%",
                    backgroundColor: "rgb(167, 149, 141)",
                    color: "white",
                  }
                : { fontSize: "1.2rem" }
            }
            key={item.point.toString()}
            onClick={() => handlePagination(item.point)}
          >
            {item.point}
          </span>
        );
      })}
    </div>
  );
};
