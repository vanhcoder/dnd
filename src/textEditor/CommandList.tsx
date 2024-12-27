interface ICommandList {
  items: string[];
  command: any;
}

export const CommandList = ({ items }: ICommandList) => {
  return (
    <div>
      <ul
        style={{
          width: "100%",
          maxWidth: 360,
          border: "1px solid black",
          padding: 0,
          overflow: "auto",
          maxHeight: 300,
        }}
      >
        {items.map((item, index) => (
          <li>
            <div>1212</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
