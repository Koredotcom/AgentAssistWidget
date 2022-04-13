import styled from 'react-emotion';

export const CustomTaskListComponentStyles = styled('div')
`
ul {
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
li {
  display: list-item;
  list-style-type: none; 
}
.nav {
  flex-wrap: wrap;
  padding-left: 0;
  list-style: none;
}
.kr-sg-input-text {
  width: 100%;
  position: relative;
  padding-top: 10px;
  padding-left: 0px;
}
.kr-sg-input-text input {
  background-color: #fff;
  border: 1px solid #bdc1c6;
  border-radius: 4px;
  height: 34px;
  font-size: 14px;
  color: #202124;
  width: calc(100% - 14px);
  line-height: normal;
  padding-left: 10px;
  margin: 0!important;
}
.align-items-center {
  align-items: center!important;
}

.justify-content-between {
  justify-content: space-between!important;
}
.d-flex {
  display: flex!important;
}
.agent-with-bots {
  font-family: Arial, Helvetica, sans-serif;
  background: #fff;
  height: 100%;
  padding-bottom: 0px;
  width: 100%;
}
.agent-with-bots .inner-bots-container {
  background: #fff;
  box-shadow: 0px 0px 6px #a8c8dd;
  border-radius: 10px;
  height: 100%;
}
.agent-with-bots .inner-bots-container .agent-bot-types {
  height: 300px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr {
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 4px;
  position: relative;
  height: 100%;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav {
  border: 0;
  margin: 0;
  background: #fff;
  box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  display: inline-flex;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  cursor: pointer;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a:hover {
  background: #009dab;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a:hover .inactive-img {
  display: none;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a:hover .active-img {
  display: block;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a .active-img {
  display: none;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a.active {
  background: #009dab;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a.active .inactive-img {
  display: none;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li a.active .active-img {
  display: block;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li .kr-sg-checkbox {
  position: absolute;
  top: 16px;
  right: 16px;
  margin: 0;
  padding: 0;
}
.agent-with-bots .inner-bots-container .agent-bot-types .bot-list-accr .nav li .kr-sg-checkbox .checkbox-custom-label {
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: #202124;
}
.agent-with-bots .inner-bots-container .agent-bot-types perfect-scrollbar {
  height: calc(100% - 118px);
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content {
  padding: 15px;
  padding-right: 5px;
  height:100%;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .logo-with-desc-text {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
  margin-top: 10px;
}
.right-align {
  justify-content: right;
}
.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 23px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}

.title-bar {
    display: flex;
}
.switch-container {
    display:flex;
    position: relative;
    
}
.user-transcript {
    margin-right: 10px;
    font-size: 14px;
}

.top-title {
    margin-right: 10px;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .logo-with-desc-text img {
  position: relative;
  top: 4px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .logo-with-desc-text .text_info {
  padding-left: 12px;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #202124;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .btn-template-data {
  position: relative;
  transition: 0.2s all ease;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .btn-template-data:hover .overlay-send-copy- {
  display: flex;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .btn-template-data:last-child {
  margin-bottom: 20px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .btn-template-data .info-template {
  background: linear-gradient(0deg, #fff, #fff);
  border: 0.5px solid #009dab;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  margin-bottom: 8px;
  padding: 7px 10px;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  font-style: italic;
  word-break: break-word;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .btn-template-data .overlay-send-copy- {
  position: absolute;
  top: 0;
  display: none;
  align-items: center;
  height: 100%;
  right: 0;
  width: 100%;
  justify-content: flex-end;
  background: linear-gradient(0deg, rgba(0, 157, 171, 0.1), rgba(0, 157, 171, 0.1)), linear-gradient(270deg, rgba(255, 255, 255, 0.9) 38.18%, rgba(255, 255, 255, 0) 55.3%);
  border-radius: 5px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .btn-template-data .overlay-send-copy- .send-copy {
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  color: #009dab;
  text-transform: uppercase;
  padding: 5px;
  margin-right: 8px;
  cursor: pointer;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .added-text-info {
  display: flex;
  margin-bottom: 10px;
  margin-top: 10px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .added-text-info .agent-asist-text {
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #202124;
  padding-left: 12px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .intent-text {
  background: #fff;
  border: 0.5px dashed #8a959f;
  box-sizing: border-box;
  border-radius: 10px;
  position: relative;
  padding: 15px 20px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .intent-text .title {
  font-weight: bold;
  font-size: 11px;
  line-height: 13px;
  color: #8a959f;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .intent-text .close-intent {
  position: absolute;
  top: 8px;
  right: 20px;
  cursor: pointer;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .intent-text .intent-info-text {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #202124;
  padding: 12px 0;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .intent-text .intent-tag {
  font-style: italic;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  color: #979797;
  width: 95%;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .intent-text .run {
  background: #009dab;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  padding: 6px 10px;
  font-weight: bold;
  font-size: 9px;
  line-height: 11px;
  color: #fff;
  cursor: pointer;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .intent-text .run.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- {
  margin-bottom: 3px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card-:first-child .card_header {
  border-radius: 8px 8px 0px 0px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card-:last-child .card_header {
  border-radius: 0px 0px 8px 8px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card_header {
  background: #f5f8fa;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card_header .card_link {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #202124;
  padding: 15px 15px 15px 44px;
  display: flex;
  align-items: center;
  position: relative;
  text-decoration: none;
  justify-content: space-between;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card_header .card_link .title-name {
  font-size: 12px;
  line-height: 15px;
  color: #202124;
  padding: 0;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card_header .card_link .count {
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #9aa0a6;
  text-align: right;
  padding: 0;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card_header .card_link::before {
  content: "";
  position: absolute;
  background-size: 100%;
  width: 16px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  left: 15px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy42MjYzNCA3LjkyNzc1QzcuODE5OTUgOC4xMjEzNiA4LjEyNjc3IDguMTMyNzUgOC4zMzM3IDcuOTYxOTJMOC4zNzEyOCA3LjkyNzc1TDE0Ljk1NTYgMS4zNDMzOUMxNS4xNjEzIDEuMTM3NjggMTUuMTYxMyAwLjgwNDE2IDE0Ljk1NTYgMC41OTg0NTJDMTQuNzYyIDAuNDA0ODQ0IDE0LjQ1NTIgMC4zOTM0NTUgMTQuMjQ4MyAwLjU2NDI4NUwxNC4yMTA3IDAuNTk4NDUyTDcuOTk4ODEgNi44MTAyNkwxLjc4NjkxIDAuNTk4NDUyQzEuNTkzMyAwLjQwNDg0NCAxLjI4NjQ4IDAuMzkzNDU1IDEuMDc5NTUgMC41NjQyODVMMS4wNDE5OCAwLjU5ODQ1MkMwLjg0ODM2OSAwLjc5MjA1OSAwLjgzNjk4IDEuMDk4ODggMS4wMDc4MSAxLjMwNTgxTDEuMDQxOTggMS4zNDMzOUw3LjYyNjM0IDcuOTI3NzVaIiBmaWxsPSIjMDA5REFCIi8+Cjwvc3ZnPgo=");
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card_header .card_link.collapsed::before {
  content: "";
  position: absolute;
  background-size: 100%;
  width: 16px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  left: 15px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy42MjYzNCA3LjkyNzc1QzcuODE5OTUgOC4xMjEzNiA4LjEyNjc3IDguMTMyNzUgOC4zMzM3IDcuOTYxOTJMOC4zNzEyOCA3LjkyNzc1TDE0Ljk1NTYgMS4zNDMzOUMxNS4xNjEzIDEuMTM3NjggMTUuMTYxMyAwLjgwNDE2IDE0Ljk1NTYgMC41OTg0NTJDMTQuNzYyIDAuNDA0ODQ0IDE0LjQ1NTIgMC4zOTM0NTUgMTQuMjQ4MyAwLjU2NDI4NUwxNC4yMTA3IDAuNTk4NDUyTDcuOTk4ODEgNi44MTAyNkwxLjc4NjkxIDAuNTk4NDUyQzEuNTkzMyAwLjQwNDg0NCAxLjI4NjQ4IDAuMzkzNDU1IDEuMDc5NTUgMC41NjQyODVMMS4wNDE5OCAwLjU5ODQ1MkMwLjg0ODM2OSAwLjc5MjA1OSAwLjgzNjk4IDEuMDk4ODggMS4wMDc4MSAxLjMwNTgxTDEuMDQxOTggMS4zNDMzOUw3LjYyNjM0IDcuOTI3NzVaIiBmaWxsPSIjMDA5REFCIi8+Cjwvc3ZnPgo=");
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card_header .card_link[aria-expanded="true"]::before {
  content: "";
  position: absolute;
  background-size: 100%;
  width: 16px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  left: 15px;
  transform: rotate(180deg);
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE2IDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy42MjYzNCA3LjkyNzc1QzcuODE5OTUgOC4xMjEzNiA4LjEyNjc3IDguMTMyNzUgOC4zMzM3IDcuOTYxOTJMOC4zNzEyOCA3LjkyNzc1TDE0Ljk1NTYgMS4zNDMzOUMxNS4xNjEzIDEuMTM3NjggMTUuMTYxMyAwLjgwNDE2IDE0Ljk1NTYgMC41OTg0NTJDMTQuNzYyIDAuNDA0ODQ0IDE0LjQ1NTIgMC4zOTM0NTUgMTQuMjQ4MyAwLjU2NDI4NUwxNC4yMTA3IDAuNTk4NDUyTDcuOTk4ODEgNi44MTAyNkwxLjc4NjkxIDAuNTk4NDUyQzEuNTkzMyAwLjQwNDg0NCAxLjI4NjQ4IDAuMzkzNDU1IDEuMDc5NTUgMC41NjQyODVMMS4wNDE5OCAwLjU5ODQ1MkMwLjg0ODM2OSAwLjc5MjA1OSAwLjgzNjk4IDEuMDk4ODggMS4wMDc4MSAxLjMwNTgxTDEuMDQxOTggMS4zNDMzOUw3LjYyNjM0IDcuOTI3NzVaIiBmaWxsPSIjMDA5REFCIi8+Cjwvc3ZnPgo=");
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card-body {
  padding: 2px 2px 1px 2px;
  background: #f5f8fa;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card-body .item-list {
  padding: 15px 16px;
  background: #fff;
  margin-bottom: 2px;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #3c4043;
  cursor: pointer;
}
.agent-with-bots .inner-bots-container .agent-bot-types .tab-content .card- .card-body .item-list:hover {
  background-color: #f5f8fa;
}
.agent-with-bots .inner-bots-container .agent-bot-types .ask-input-assist {
  padding: 15px;
}
.agent-with-bots .inner-bots-container .agent-bot-types .ask-input-assist .input-text {
  background: #fff;
  border-radius: 6px;
  padding: 10px 20px !important;
}
.agent-with-bots .inner-bots-container .agent-bot-types .ask-input-assist .input-text::placeholder {
  color: #d8d8d8;
}
.agent-with-bots .inner-bots-container .agent-bot-types .input-search-bot {
  padding: 15px;
  position: relative;
}
.agent-with-bots .inner-bots-container .agent-bot-types .input-search-bot .input-text {
  background: #fff;
  border-radius: 6px;
  padding: 10px 20px 10px 36px !important;
}
.agent-with-bots .inner-bots-container .agent-bot-types .input-search-bot .input-text::placeholder {
  color: #d8d8d8;
}
.agent-with-bots .inner-bots-container .agent-bot-types .input-search-bot img {
  position: absolute;
  left: 30px;
  top: 25px;
}
.agent-with-bots .textTempl {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 3px 10px;
  position: absolute;
  width: 290px;
  height: 30px;
  right: 42px;
  top: 218px;
  background: #e9eff4;
  border: 0.5px solid #009dab;
 /* Super Light Shadow */
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}
.agent-with-bots .curser-pointer {
  cursor: pointer;
}
.agent-with-bots .curser-pointer:hover {
  background-color: #f5f8fa;
}

`;
