import styled from "vue-styled-components";

const CloseButton = styled('button')`
  & {
		width: 16px;
		height: 16px;
		background-color: transparent;
		border: 0;
		padding: 8px;
		cursor: pointer;
		position: relative;
	}
	&:before, &:after {
		position: absolute;
		top: 0px;
		left: 7px;
		content: ' ';
		height: 16px;
		width: 2px;
		background-color: #333;
	}
	&:before {
		transform: rotate(45deg);
	}
	&:after {
		transform: rotate(-45deg);
	}
`;

export default CloseButton;