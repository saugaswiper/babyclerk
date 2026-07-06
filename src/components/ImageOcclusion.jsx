// Renders an image with rectangular occlusions. Boxes are stored as fractions
// (0–1) of the image so they scale to any width. When `revealed`, the boxes
// switch from solid covers to thin outlines so you can check the spot.
export default function ImageOcclusion({ image, boxes = [], revealed }) {
  return (
    <div className="io-viewer">
      <img src={image} alt="" draggable={false} />
      {boxes.map((b, i) => (
        <div
          key={i}
          className={`io-box ${revealed ? 'revealed' : ''}`}
          style={{
            left: `${b.x * 100}%`,
            top: `${b.y * 100}%`,
            width: `${b.w * 100}%`,
            height: `${b.h * 100}%`,
          }}
        />
      ))}
    </div>
  )
}
