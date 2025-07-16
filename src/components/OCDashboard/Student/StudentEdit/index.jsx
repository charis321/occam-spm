import { Button } from "antd";
import { PlusCircleOutlined, FileAddOutlined } from "@ant-design/icons";

export default function OCStudentEdit(props){


  return <div className="oc-student-edit">
            <Button><PlusCircleOutlined />新增學生</Button>
            <Button color="cyan" variant="solid" ><FileAddOutlined />批量新增學生</Button>
            <input type="file"></input>
         </div>
}