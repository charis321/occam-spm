import { Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import './index.css'

// OCConfirm 為occam自定義的系統確認組件，用於重要操作的確認提示
// content: 要顯示的內容，需要是字符串或React元素
// onConfirm: 確認按鈕的回調函數
// onCancel: 取消按鈕的回調函數

export default function OCConfirm({ content, onConfirm, onCancel }){
  return (
    <div className="oc-confirm-block">
      <div className="oc-confirm">
        <div className="oc-confirm-title"> 
            <h3><InfoCircleOutlined /> 系統確認</h3>
        </div>
        <div className="oc-confirm-content" >{content}</div>
        <div className="oc-confirm-action">
          <Button className="oc-confirm-btn confirm" type='primary' onClick={onConfirm}>確定</Button>
          <Button className="oc-confirm-btn cancel" onClick={onCancel}>取消</Button>
        </div>
      </div>
    </div>
  )
}
