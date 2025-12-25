import { Typography, Col, Row} from 'antd';
const { Title} = Typography;

interface RunPageTitleProps{
  titleText: string;
  gameName: string;
}
//Create your run
export function RunPageTitle({titleText, gameName}: RunPageTitleProps){
  return (
    <Row>
      <Col span= {8}>
        <Title className="inline w-lg">{titleText}</Title>
      </Col>
      <Col offset={8} span={8} >
        <div className="w-full flex justify-end">
          <Title className="inline text-right w-full">{gameName}</Title>
        </div>
      </Col>
    </Row>
  )
}
  
