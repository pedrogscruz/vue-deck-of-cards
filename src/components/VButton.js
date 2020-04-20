import styled from "vue-styled-components";

const typeButton = { primary: Boolean, disabled: Boolean };

const styleButton = ({ primary, disabled }) => {
	if (primary) {
		if (disabled)
			return `
				background:
					linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
					linear-gradient(white, white);
				color: rgba(255,255,255, 0.6);
				pointer-events: none;
				border: 2px solid transparent;
			`
		else
			return `
				background-color: black;
				color: white;
				border: 2px solid #ccc;
			`;
	}
	else {
		if (disabled)
			return`
				background:
					linear-gradient(rgba(180, 0, 0, 0.6), rgba(75, 0, 0, 0.6)),
					linear-gradient(white, white);
				color: rgba(255,255,255, 0.6);
				pointer-events: none;
			`
		else
			return `
				background-image: linear-gradient(#b40000, #4b0000);
				color: white;
			`;
	}
}

const Button = styled('button', typeButton)`
	font-size: 12px;
	font-weight: 600;
	border: 0;
	border-radius: 4px;
	text-transform: uppercase;
	padding-top: 10px;
	padding-bottom: 10px;
	padding-left: 15px;
	padding-right: 15px;
	${props => styleButton(props)};
`;

export default Button;