export default function Select({ text, change, options }) {
    return(
        <div>
            <label>{text}</label>
            <select onChange={(e) => {change(e.target.value)}}>
                {options.map(op => {
                    <option value={op}>{op}</option>
                })}
            </select>
        </div>
    )
}