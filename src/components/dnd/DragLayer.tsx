import { useDragLayer } from "react-dnd";

const DragLayer = () => {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
      currentOffset: monitor.getClientOffset(),
    })
  );

  if (!isDragging) return null;

  // Tạo hiệu ứng khi kéo
  const style = {
    top: currentOffset?.y - 20,
    left: currentOffset?.x - 20,
    opacity: 0.7,
    pointerEvents: "none", // Đảm bảo con chuột không bị chặn bởi phần tử này
    zIndex: 9999,
    filter: "blur(3px)", // Tạo hiệu ứng mờ cho phần tử
    transition: "transform 0.2s ease",
    transform: "scale(1.1)", // Tạo cảm giác phóng to khi kéo
  };

  return (
    <div style={style}>
      <div>
        {item.text} {/* Hiển thị text của phần tử đang kéo */}
      </div>
    </div>
  );
};

export default DragLayer;
