export default function Input({ type, text, placeholder, change}) {
    const cambio = (e) => {
        if (type === "file") {
            change(e.target.files[0]);
        } else {
            change(e.target.value);
        }
    }

    return(
        <div>
            <h3>{text}</h3>
            <input type={type} placeholder={type !== "file" ? placeholder : undefined} onChange={cambio}></input>
        </div>
    )
}