import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import notie from 'notie';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor'
import printJS from 'print-js';
import './components/Dropdown.css';
import initContent from './initContent';
import './App.css';
import fileDownload from 'js-file-download';
import { addStyleSheet, removeStyleSheet} from './utils/sheetManager';
import decorateHtml from './utils/decorateHtml';
import githubCssForEditor from './customization/githubCssForEditor';
import githubCssForPdf from "./customization/githubCssForPdf";
import tuiCssForEditor from "./customization/tuiCssForEditor";
import tuiCssForPdf from "./customization/tuiCssForPdf";
import timqianCssForPdf from "./customization/timqianCssForPdf";
import timqianCssForEditor from "./customization/timqianCssForEditor";

const themes = {
  tui: {
    name: 'tui',
    pdfCss: tuiCssForPdf,
    editorCss: tuiCssForEditor,
  },
  github: {
    name: 'github',
    pdfCss: githubCssForPdf,
    editorCss: githubCssForEditor,
  },
  timqian: {
    name: 'timqian',
    pdfCss: timqianCssForPdf,
    editorCss: timqianCssForEditor,
  }
}

function App() {
  const editorEl = useRef(null);
  const queryObj = queryString.parse(window.location.search);
  const queryMdEncoded = queryObj.md;
  // const localMd = window.localStorage.getItem('mdContent');
  let initMdContent = initContent;
 // if (localMd) initMdContent = localMd;
  if (queryMdEncoded) initMdContent = decodeURIComponent(queryMdEncoded);
  const [theme, setTheme] = useState(themes.tui.name);

  // only run on first render.
  useEffect(() => {
    addStyleSheet({
      // css: themes[theme].editorCss,
      // id: themes[theme].name,
      css: githubCssForEditor,
      id: 'github'
    });
  }, []);


  const updateTheme = (newTheme) => {
   // removeStyleSheet(theme);
    setTheme(newTheme);
    addStyleSheet({
      css: themes[newTheme].editorCss,
      id: newTheme,
    });
  }

  const onMdContentChange = () => {
    // const value = editorEl.current.getInstance().getValue();
    // const value = editorEl.current.rootEl.current.innerText
    // window.localStorage.setItem('mdContent', value);
  }

  const downloadMD = () => {
    fileDownload(editorEl.current.rootEl.current.innerText, 'resume.md');
   // fileDownload( editorEl.current.rootEl.current.innerText, 'resume.md');
    fileDownload(document.getElementsByClassName('toastui-editor-md-preview')[0].innerText, 'resume.md')

  }

  const downloadHTML = () => {
   // const editorHtml = editorEl.current.getInstance().getHtml();
    const editorHtml = document.querySelector('toastui-editor-md-preview')
   // console.log(editorHtml)
    const decoratedHtml = decorateHtml({
      mdHtml: editorHtml,
      css: themes[theme].pdfCss,
    });
    fileDownload(decoratedHtml, 'resume.html');
  }

  const downloadPDF = () => {
    const editorHtml = document.getElementsByClassName('toastui-editor-md-preview')[0].innerHTML

    // const editorHtml =editorEl.current.rootEl.current.outerHTML
    // console.log(editorEl.current)
    const decoratedHtml = decorateHtml({
      mdHtml: editorHtml,
      css: themes[theme].pdfCss,
    });
    printJS({
      type: 'raw-html',
      css: "",
      scanStyles: true,
      printable: decoratedHtml,
      targetStyles: ['*'],
      documentTitle: "&nbsp"
    });
  }

  const getShareLink = () => {
    const md = window.localStorage.getItem('mdContent');
    const url = window.location.origin + '?' + queryString.stringify({md: encodeURIComponent(md)});
    console.log(url);
    notie.alert({ text: `Share this editable resume to others with <br/><a href="${url}">this link</a>`, type: 'success', time: 6});
  }

  return (
      <div className="App">
        <header>
          <div className="header-left">
            {/*<a href="/"><img src="https://i.v2ex.co/e0W134z7.png" className="App-logo" alt="logo" /></a>*/}
          </div>
          <div className="header-right">
            {/*<div className="dropdown">*/}
            {/*  <a className="header-link" > Themes <span style={{fontSize:'10px'}}>▼</span></a>*/}
            {/*  <div className="dropdown-content">*/}
            {/*    <a  onClick={() => updateTheme(themes.tui.name)}>TUI</a>*/}
            {/*    <a  onClick={() => updateTheme(themes.timqian.name)}>timqian.com</a>*/}
            {/*    <a  onClick={() => updateTheme(themes.github.name)}>GitHub</a>*/}
            {/*    /!*<hr/>*!/*/}
            {/*    /!*<a href="https://github.com/timqian/resumd/issues/1"><i><small>Customize</small></i></a>*!/*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className="dropdown">
              <a className="header-link" > Download <span style={{fontSize:'10px'}}>▼</span></a>
              <div className="dropdown-content">
                <a  onClick={() => downloadPDF()}>PDF</a>
                <a  onClick={() => downloadMD()}>Markdown</a>
                <a  onClick={() => downloadHTML()}>HTML</a>
              </div>
            </div>
            {/*<a className="header-link"  onClick={() => getShareLink()}>*/}
            {/*  <span>Get Link </span>*/}

            {/*  <svg xmlns="http://www.w3.org/2000/svg" width="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>*/}
            {/*</a>*/}
          </div>
        </header>
        <Editor
            ref={editorEl}
            initialValue={initMdContent}
            previewStyle={window.innerWidth > 700 ? 'vertical': 'tab'}
            height="calc(100vh - 64px)"
            initialEditType="markdown"
            useCommandShortcut={false}
            onChange={() => onMdContentChange()}
            exts={[
              'scrollSync',
            ]}
        />

      </div>
  );
}

export default App;
