import ReactDOM from "react-dom";

type Popup = {
  popup: {
    x: number;
    y: number;
    visible: boolean;
  };
  suggestions: string[];
  insertSuggestion: (s: string) => void;
};

function PopupSuggestion({ popup, suggestions, insertSuggestion }: Popup) {
  return (
    <>
      {popup.visible && (
        <div
          style={{
            position: "absolute",
            top: popup.y,
            left: popup.x,
            backgroundColor: "white",
            border: "1px solid gray",
            borderRadius: "4px",
            padding: "4px",
            zIndex: 1000,
          }}
        >
          {suggestions.map((s) => (
            <div
              key={s}
              style={{ padding: "2px 4px", cursor: "pointer" }}
              onMouseDown={() => insertSuggestion(s)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PopUpS(props: Popup) {
  return ReactDOM.createPortal(<PopupSuggestion {...props} />, document.body);
}

export default PopUpS;
