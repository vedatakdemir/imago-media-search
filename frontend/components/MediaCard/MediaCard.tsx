import {
  CalendarOutlined,
  CameraOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import { Card, Modal, Tag, Tooltip } from "antd";
import { useState } from "react";
import styles from "./MediaCard.module.css";

type Props = {
  title: string;
  photographer: string;
  date: string;
  imageUrl: string;
};

const MediaCard = ({ title, photographer, date, imageUrl }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Card
        hoverable
        cover={
          <div className={styles["image-container"]}>
            <img alt={title} src={imageUrl} className={styles["card-image"]} />
            <div className={styles["image-overlay"]}>
              <Tooltip title="View Full Size">
                <ExpandOutlined
                  className={styles["expand-icon"]}
                  onClick={() => setIsModalOpen(true)}
                />
              </Tooltip>
            </div>
          </div>
        }
        className={`${styles["media-card"]} ${styles["card-body"]}`}
      >
        <div className={styles["card-metadata"]}>
          <Tag icon={<CameraOutlined />} color="processing">
            {photographer}
          </Tag>
          <Tag icon={<CalendarOutlined />}>{formattedDate}</Tag>
        </div>
        <Tooltip title={title}>
          <div className={styles["card-title"]}>{title}</div>
        </Tooltip>
      </Card>

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        width="85%"
        className="media-modal"
      >
        <div className={styles["modal-content"]}>
          <div className={styles["modal-image-container"]}>
            <img src={imageUrl} alt={title} className={styles["modal-image"]} />
          </div>
          <div className="modal-info">
            <h3 className={styles["modal-title"]}>{title}</h3>
            <div className={styles["modal-metadata"]}>
              <Tag icon={<CameraOutlined />} color="processing">
                {photographer}
              </Tag>
              <Tag icon={<CalendarOutlined />}>{formattedDate}</Tag>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MediaCard;
