export default function GraphExample() {
  return (
    <div className="rounded border p-4">
      <h2 className="text-center font-semibold">그래프 예시</h2>
      <div className="mt-4 grid grid-cols-12 gap-2">
        <select className="col-span-4 rounded border p-2">
          <option>1차카테고리</option>
        </select>
        <select className="col-span-4 rounded border p-2">
          <option>2차카테고리</option>
        </select>
        <input
          type="text"
          placeholder="텍스트 입력"
          className="col-span-4 rounded border p-2"
        />
      </div>
      <div className="mt-4 h-40 rounded bg-gray-100" />
    </div>
  );
}
