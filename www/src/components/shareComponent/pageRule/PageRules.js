import React, { Component } from "react";
import "./pageRules.css";

import AxiosCore from '../../../funStore/AxiosCore';

export default class PageFragRule extends Component {
    constructor() {
        super()
        this.state = {
            bubbleFlag: false,
            barrier: 0,
            groupCount: 5,
            startPage: 1
        }
    }
    _getPageInfo = (url) => {
        let paramas = this.props.searchParamas;
        AxiosCore.post(url, paramas).then(res => {
            this.props.pullData(res)
        }).catch(req => {
            console.log(req)
        })
    }
    beforePage = (e) => {
        e.stopPropagation()
        e.preventDefault()
        let url = this.props.url
        const _currentPage = this.props.pageInfo.currentPage - 1;

        this.changePage(_currentPage + 1);
        // const size = this.props.pageSize == undefined ? '10' : this.props.pageSize
        const size = this.props.pageInfo.pageSize
        url = url + '?_currentPage=' + _currentPage + '&_pageSize=' + size
        this._getPageInfo(url)
    }
    changePage(currentPage) {
        const { groupCount } = this.state
        //当 当前页码 大于 分组的页码 时，使 当前页 前面 显示 两个页码
        if (currentPage >= groupCount) {
            this.setState({
                startPage: currentPage - 2,
            })
        }
        if (currentPage < groupCount) {
            this.setState({
                startPage: 1,
            })
        }
        //第一页时重新设置分组的起始页
        if (currentPage === 0) {
            this.setState({
                startPage: 1,
            })
        }
    }

    nextPage = (e) => {
        e.stopPropagation()
        e.preventDefault()
        let url = this.props.url
        const _currentPage = this.props.pageInfo.currentPage + 1
        this.changePage(_currentPage + 1);
        // const size = this.props.pageSize == undefined ? '10' : this.props.pageSize
        const size = this.props.pageInfo.pageSize
        url = url + '?_currentPage=' + _currentPage + '&_pageSize=' + size
        this._getPageInfo(url)
    }
    targetPage = (e) => {
        e.stopPropagation()
        e.preventDefault()
        let url = this.props.url

        const _currentPage = parseInt(e.target.id)
        this.changePage(_currentPage + 1);
        // const size = this.props.pageSize == undefined ? '10' : this.props.pageSize
        const size = this.props.pageInfo.pageSize
        url = url + '?_currentPage=' + _currentPage + '&_pageSize=' + size
        this._getPageInfo(url)
    }
    lastPage = (e) => {
        e.stopPropagation()
        e.preventDefault()
        let url = this.props.url
        let _currentPage = this.props.pageInfo.totalPage - 1;
        this.changePage(_currentPage + 1);
        // const size = this.props.pageSize == undefined ? '10' : this.props.pageSize
        const size = this.props.pageInfo.pageSize
        url = url + '?_currentPage=' + _currentPage + '&_pageSize=' + size
        if (this.props.pageInfo.currentPage != this.props.pageInfo.totalPage - 1) {
            this._getPageInfo(url)
        }
    }
    firstPage = (e) => {
        e.stopPropagation()
        e.preventDefault()
        let url = this.props.url
        let _currentPage = 0;
        this.changePage(_currentPage + 1);
        // const size = this.props.pageSize == undefined ? '10' : this.props.pageSize
        const size = this.props.pageInfo.pageSize
        url = url + '?_currentPage=' + _currentPage + '&_pageSize=' + size
        if (this.props.pageInfo.currentPage != 0) {
            this._getPageInfo(url)
        }
    }
    handlePageSize = (pageSize) => {
        ////console.log('pageSize',pageSize)
        let url = this.props.url
        let _currentPage = this.props.pageInfo.currentPage
        this.changePage(_currentPage + 1)
        url = url + '?_currentPage=' + _currentPage + '&_pageSize=' + pageSize
        if (this.props.pageInfo.currentPage != this.props.pageInfo.totalPage - 1 || this.props.pageInfo.currentPage != 0 || this.props.pageInfo.pageSize !== pageSize) {
            this._getPageInfo(url)
        }
        this.setState({
            bubbleFlag: false
        })
    }
    barrierHandle = () => {
        this.setState({
            barrier: 1,
            bubbleFlag: true
        })
    }

    unBarrierHandle = () => {
        this.setState({
            barrier: 2,
            bubbleFlag: false
        })
    }
    enterBubble = () => {
        this.setState({
            bubbleFlag: true
        })
    }
    leaveBubble = () => {
        if (this.state.barrier !== 1) {
            this.setState({
                bubbleFlag: false
            })
        }
    }

    render() {
        const { bubbleFlag, groupCount, startPage } = this.state
        const { pageInfo } = this.props
        const pageSize = pageInfo.pageSize
        const totalPageNumber = pageInfo.totalPage
        const currentPageNumber = pageInfo.currentPage + 1
        const items = []
        items.push(
            <li key={-1} className="firstPage" onClick={this.firstPage}>首页</li>
        )
        items.push(
            <li key={-2} className="prevPage" onClick={this.beforePage}
                style={{ display: currentPageNumber == 1 ? 'none' : 'inline-block' }}>上一页
                        </li>
        )
        if (totalPageNumber <= 7) {
            for (let i = 1; i <= totalPageNumber; i++) {
                items.push(
                    <li
                        className={i == currentPageNumber ? "pages currentPage" : "pages"}
                        key={i}
                        id={i - 1}
                        onClick={this.targetPage}
                    >{i}</li>
                )
            }
        } else {
            items.push(
                <li
                    className={1 == currentPageNumber ? "pages currentPage" : "pages"}
                    key={1}
                    id={0}
                    onClick={this.targetPage}
                >1</li>
            )
            let pageLength = 0;
            if (startPage + groupCount > totalPageNumber) {
                pageLength = totalPageNumber
            } else {
                pageLength = groupCount + startPage;
            }
            if (currentPageNumber >= groupCount) {
                items.push(<li
                    className={-3 == currentPageNumber ? "pages currentPage" : "pagess"}
                    key={-3}
                >...</li>)
            }
            for (let i = startPage; i < pageLength; i++) {
                if (i < totalPageNumber && i > 1) {
                    items.push(
                        <li
                            className={i == currentPageNumber ? "pages currentPage" : "pages"}
                            key={i}
                            id={i - 1}
                            onClick={this.targetPage}
                        >{i}</li>
                    )
                }
            }
            if (totalPageNumber - startPage >= groupCount + 1) {
                items.push(<li
                    className={-5 == currentPageNumber ? "pages currentPage" : "pagess"}
                    key={-5}
                >...</li>)
            }
            items.push(
                <li
                    className={totalPageNumber == currentPageNumber ? "pages currentPage" : "pages"}
                    key={totalPageNumber}
                    id={totalPageNumber - 1}
                    onClick={this.targetPage}
                >{totalPageNumber}</li>
            )
        }
        return (
            <div className="pageFragWrapper">
                <div className="numberSwitch">
                    <ul>
                        {items}
                        <li key={-6} className="nextPage" onClick={this.nextPage}
                            style={{ display: currentPageNumber == totalPageNumber ? 'none' : 'inline-block' }}>下一页
                        </li>
                        <li key={-7} className="lastPage" onClick={this.lastPage}>末页</li>
                    </ul>
                </div>
            </div>
        )
    }
}