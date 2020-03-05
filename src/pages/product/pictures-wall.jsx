/**
 * 图片上传
 */
import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../config/constant';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    constructor(props) {
        super(props);
        const { imgs } = props;
        let fileList = [];
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己的唯一id
                name: img, // 图片文件名
                status: 'done', // 图片状态:done-已上传, uploading-正在上传, removed-已删除
                url: BASE_IMG_URL + img // 图片地址
            }))
        }
        this.state = {
            previewVisible: false, // 表示是否显示大图预览 modal
            previewImage: '', // 大图url
            fileList
        }
    }

    /**
     * 获取图片名
     */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });
    /**
     * 图片预览
     */
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /**
     * file: 当前操作的文件(上传/删除)
     * fileList: 所有已上传文件对象数组
     */
    handleChange = async ({ file, fileList }) => {
        if (file.status === "done") {
            const result = file.response;
            if (result.status === 0) {
                message.success("图片上传成功");
                const { name, url } = result.data;
                const newfile = fileList[fileList.length - 1];
                // 修正name url
                newfile.url = url;
                newfile.name = name;
            } else {
                message.error("图片上传失败")
            }
        } else if (file.status === "removed") {
            // console.log("删除", file)
            // 删除图片
            const result = await reqDeleteImg(file.name);
            if (result.status === 0) {
                message.success("图片删除成功")
            } else {
                message.success("图片删除失败")
            }
        }
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" // 上传图片的接口地址
                    accept="image/*" // 只接收突变格式
                    name="image" // 请求参数
                    listType="picture-card"// 显示样式
                    fileList={fileList} // 所有已上传图片文件对象数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                {/* 大图预览 */}
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}