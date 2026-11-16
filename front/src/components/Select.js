export default function Select({ text, change, options }) {
    return(
        <div>
            <label>{text}</label>
            <select onChange={(e) => {change(e.target.value)}}>
                {options.map(op => (
                    <option key={op} value={op}>{op}</option>
                ))}
            </select>
        </div>
    )
}