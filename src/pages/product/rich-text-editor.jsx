/**
 * 富文本编辑器
 */
import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {
    constructor(props) {
      super(props);
      const html = props.detail || "";
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState
        };
      }
    }
  
    onEditorStateChange = (editorState) => {
      this.setState({
        editorState,
      });
    };
    
    /**
     * 获取描述
     */
    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    }
    render() {
      const { editorState } = this.state;
      return (
          <Editor
            editorState={editorState}
            editorStyle={{border: "1px solid black", paddingLeft: "10px", height: "200px"}}
            onEditorStateChange={this.onEditorStateChange}
          />
      );
    }
  }
