function Input({name, state, setState, label = false}) {
	return (
		<div className="flex gap-1 flex-col">
			{label && (
				<label htmlFor={name} className=" Itext-teal-light text-lg px-1">
					{name}
				</label>
			)}
			<div>
				<input
					type="text"
					name={name}
					value={state}
					onChange={(e) => setState(e.target.value)}
					className="bg-input-background text-start focus:outline-none "
					I
				/>
			</div>
		</div>
	);
}
export default Input;
