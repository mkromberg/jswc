import * as AppIcons from './RibbonIcons';
import { Row, Col } from 'reactstrap';
import { useAppData } from '../../hooks';
import { getObjectById } from '../../utils';

const CustomRibbonButtonGroup = ({ data }) => {
  const { socket, dataRef } = useAppData();
  const PORT = localStorage.getItem('PORT');
  let ImageList = JSON.parse(localStorage.getItem('ImageList'));

  const { Captions, Icons, Event, ImageIndex, ImageListObj } = data?.Properties;

  const colSize = Captions?.length == 4 ? 6 : 12;

  const handleSelectEvent = (info) => {
    const selectEvent = JSON.stringify({
      Event: {
        EventName: 'Select',
        ID: data?.ID,
        Info: [info],
      },
    });
    const exists = Event && Event.some((item) => item[0] === 'Select');
    if (!exists) return;
    console.log(selectEvent);
    socket.send(selectEvent);
  };

  const handleButtonEvent = (info) => {
    handleSelectEvent(info);
  };

  if (ImageListObj) {
    if (Array.isArray(ImageListObj)) {
      const ImagesData = ImageListObj?.map((id) => {
        return id && JSON.parse(getObjectById(dataRef.current, id));
      });

      const images = ImageIndex.map((imageIndex, index) => {
        return ImagesData && ImagesData[index]?.Properties?.Files[imageIndex - 1];
      });
    } else {
      const ID = ImageListObj.split('.')[1];
      ImageList = ID && JSON.parse(getObjectById(dataRef.current, ID));
    }
    // const ID = getStringafterPeriod(ImageListObj);
    // ImageList = ID && JSON.parse(getObjectById(dataRef.current, ID));
  }

  // console.log({ Icons });

  // console.log({ AppIcons });

  return (
    <Row>
      {Captions.map((title, i) => {
        let IconComponent = AppIcons[Icons?.length > 0 ? Icons[i] : 'MdOutlineQuestionMark'];
        return (
          <Col
            id={data?.ID}
            md={colSize}
            className='d-flex align-items-center justify-content-center'
            style={{ cursor: 'pointer' }}
            onClick={() => handleButtonEvent(i + 1)}
          >
            {
              ImageIndex?.length > 0 ? (
                <img
                  style={{
                    width: ImageList?.Properties?.Size && ImageList?.Properties?.Size[1],
                    height: ImageList?.Properties?.Size && ImageList?.Properties?.Size[0],
                  }}
                  src={`http://localhost:${PORT}/${
                    ImageList?.Properties?.Files[ImageIndex[i] - 1]
                  }`}
                />
              ) : (
                <IconComponent />
              )
              // null
            }
            <div style={{ fontSize: '12px', textAlign: 'center', textOverflow: 'ellipsis' }}>
              {title}
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default CustomRibbonButtonGroup;
