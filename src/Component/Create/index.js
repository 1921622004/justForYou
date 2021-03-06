import React from 'react';
// import {UserModel,ArticleModel} from '../dataModel02';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../Actions';

class Create extends React.Component {
  constructor(props) {
    super(props);
    var token = localStorage.getItem('userToken')
    if (!token) {
      location.hash = "/login";
    }
    this.state = {
      token: token,
      title: '',
      content: '',
      pageTitle: '发表文章',
      articleId: null
    }
  }

  componentDidMount() {
    let articleId = this.props.match.params.id;
    if (articleId) {
      // this.fetchData(articleId);
      this.props.actions.articleDetail(articleId)
      this.setState({pageTitle: '修改文章', articleId: articleId})
    }
  }

  handlePublish(e) {
    let title = this.refs.title.value;
    let content = this.refs.content.value;
    if (title == '') {
      $.alert('标题不能为空')
      return;
    }
    if (content == '') {
      $.alert('内容不能为空')
      return;
    }
    let info = {
      title: title,
      content: content,
      token: this.state.token,
      article: this.state.articleId ? this.state.articleId : ''
    }
    this.props.actions.articlePulish(info);

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id && nextProps.articleDetail.data) {
      let data = nextProps.articleDetail.data;
      this.setState({
        title: data.content.title,
        content: data.content.content,
        article: data.content.article_id
      })
    }
    if (nextProps.articlePulishState.data) {
      $.toast(nextProps.articlePulishState.data.content);
      this.props.actions.articlePulishDone();
      location.hash = '/indexList'
    }
  }

  handleChangeVal(e, key) {
    let val = e.target.value;
    if (key == 'title') {
      this.setState({title: val})
    } else {
      this.setState({content: val})
    }
  }

  handleCancel() {
    this.setState({
      title: '',
      content: ''
    })
    location.hash = '/indexList'
  }

  render() {
    return (
      <div>
        <header className="bar bar-nav">
          <h1 className='title'>{this.state.pageTitle}</h1>
        </header>
        <div className="content">
          <div className="list-block">
            <ul>
              <li >
                <div className="item-content">
                  <div className="item-inner" style={{borderBottom: "2px solid #eee"}}>
                    <div className="item-input">
                      <input type="text" ref="title" placeholder="请输入标题" value={this.state.title} onChange={(e) => {
                        this.handleChangeVal(e, 'title')
                      }}/>
                    </div>
                  </div>
                </div>
              </li>
              <li className="align-top">
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-input">
                      <textarea placeholder="请输入内容" ref="content" style={{height: "13rem"}} onChange={(e) => {
                        this.handleChangeVal(e, 'content')
                      }} value={this.state.content}/>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="content-block">
            <div className="row">
              <div className="col-50"><a className="button button-big button-fill button-danger" onClick={(e) => {
                this.handleCancel(e)
              }}>取消</a></div>
              <div className="col-50"><a className="button button-big button-fill button-success" onClick={(e) => {
                this.handlePublish(e)
              }}>发表</a></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    articlePulishState: state.articlePulish,
    articleDetail: state.articleDetail
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

const CreateBox = connect(mapStateToProps, mapDispatchToProps)(Create)

module.exports = CreateBox;
// export default Create;
