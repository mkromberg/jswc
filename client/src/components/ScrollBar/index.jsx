import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../../common';
import './ScrollBar.css';
import { useAppData } from '../../hooks';


const ScrollBar = ({ data }) => {
  const { FA } = Icons;
  const { Align, Type, Thumb, Range, Event, Visible, Size } = data?.Properties;
  console.log("thumb", Thumb, "data", data )
  const isHorizontal = Type === 'Scroll' && Align === 'Bottom';
  const [scaledValue, setScaledValue] = useState(Thumb || 1);

  const parentSize = JSON.parse(localStorage.getItem('formDimension'));
  // console.log("thumb", thumb)
  const [showButtons, setShowButtons] = useState(false);


  const emitEvent = Event && Event[0];

  const handleTrackMouseEnter = () => {
    setShowButtons(true);
  };

  const handleTrackMouseLeave = () => {
    setShowButtons(false);
  };

  const { socket } = useAppData();

  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const maxValue = Range;

  // const trackHeight = parentSize && parentSize[0];
  // const trackWidth = parentSize && parentSize[1];
  const trackHeight = !Size ? parentSize && parentSize[0] : Size && Size[0];
  const trackWidth = !Size ? parentSize && parentSize[1] : Size && Size[1];

  const handleThumbDrag = (event) => {
    event.preventDefault();

    const startPosition = isHorizontal ? event.clientX : event.clientY;

    const handleMouseMove = (moveEvent) => {
      const currentPosition = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const newPosition = thumbPosition + (currentPosition - startPosition);

      const newThumbPosition = Math.max(0, Math.min(maxThumbPosition, newPosition));
      const newScaledValue = (newThumbPosition / maxThumbPosition) * maxValue;

      if (newScaledValue >= 1 && newScaledValue <= maxValue) {
        setScaledValue(newScaledValue);

        if (isHorizontal) {
          localStorage.setItem(
            'horizontalScroll',
            JSON.stringify({
              oldValue: Math.round(scaledValue),
              newValue: Math.round(newScaledValue),
            })
          );
        } else {
          localStorage.setItem(
            'verticalScroll',
            JSON.stringify({
              oldValue: Math.round(scaledValue),
              newValue: Math.round(newScaledValue),
            })
          );
        }

        const event = JSON.stringify({
          Event: {
            EventName: 'Scroll',
            ID: data?.ID,
            Info: [0, Math.round(newScaledValue)],
          },
        });

        console.log(event);
        localStorage.setItem(data.ID, event);
        const exists = Event && Event.some((item) => item[0] === 'Scroll');
        if (!exists) return;

        socket.send(event);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTrackClick = (event) => {
    if (thumbRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const clickPosition = isHorizontal
        ? event.clientX - trackRect.left
        : event.clientY - trackRect.top;

      const newScaledValue = isHorizontal
        ? (clickPosition / trackWidth) * maxValue
        : (clickPosition / (trackHeight - 50)) * maxValue;

      if (newScaledValue >= 1 && newScaledValue <= maxValue) {
        setScaledValue(newScaledValue);

        const scrollEvent = JSON.stringify({
          Event: {
            EventName: emitEvent && emitEvent[0],
            ID: data?.ID,
            Info: [
              Math.round(scaledValue) < Math.round(newScaledValue) ? 2 : -2,
              Math.round(newScaledValue),
            ],
          },
        });

        console.log('Event', scrollEvent);
        localStorage.setItem(data.ID, scrollEvent);

        if (isHorizontal) {
          localStorage.setItem(
            'horizontalScroll',
            JSON.stringify({
              oldValue: Math.round(scaledValue),
              newValue: Math.round(newScaledValue),
            })
          );
        } else {
          localStorage.setItem(
            'verticalScroll',
            JSON.stringify({
              oldValue: Math.round(scaledValue),
              newValue: Math.round(newScaledValue),
            })
          );
        }
        const exists = Event && Event.some((item) => item[0] === 'Scroll');
        if (!exists) return;
        socket.send(
          JSON.stringify({
            Event: {
              EventName: 'Scroll',
              ID: data?.ID,
              Info: [
                Math.round(scaledValue) < Math.round(newScaledValue) ? 2 : -2,
                Math.round(newScaledValue),
              ],
            },
          })
        );
      }
    }
  };

  let thumbPosition = (scaledValue / maxValue) * (trackHeight - 40); // Adjust for Height

  // adjust for the width
  if (isHorizontal) {
    thumbPosition = (scaledValue / maxValue) * (trackWidth - 40);
  }

  const maxThumbPosition = isHorizontal ? trackWidth - 50 : trackHeight - 100;

  const trackStyle = {
    width: isHorizontal ? `${trackWidth}px` : '12px',
    height: isHorizontal ? '12px' : `${trackHeight}px`,
  };

  const thumbStyle = {
    width: isHorizontal ? '40px' : '6px',
    height: isHorizontal ? '6px' : '40px',
    backgroundColor: '#9E9E9E',
    position: 'absolute',
    left: isHorizontal ? `${thumbPosition}px` : 2,
    top: isHorizontal ? 2 : `${thumbPosition}px`,
    cursor: 'pointer',
    borderRadius: '5px',
  };

  const verticalPosition = {
    position: 'absolute',
    top: 0,
    right: 0,
    display: Visible == 0 ? 'none' : 'block',
  };

  const horizontalPosition = {
    position: 'absolute',
    left: 0,
    bottom: 0,
    display: Visible == 0 ? 'none' : 'block',
  };

  const incrementScale = () => {
    const newScaledValue = scaledValue + 1;
    if (newScaledValue <= maxValue) {
      setScaledValue(newScaledValue);
      console.log(
        'Event',
        JSON.stringify({
          Event: {
            EventName: emitEvent && emitEvent[0],
            ID: data?.ID,
            Info: [1, Math.round(newScaledValue)],
          },
        })
      );

      localStorage.setItem(
        data.ID,
        JSON.stringify({
          Event: {
            EventName: emitEvent && emitEvent[0],
            ID: data?.ID,
            Info: [1, Math.round(newScaledValue)],
          },
        })
      );

      if (isHorizontal) {
        localStorage.setItem(
          'horizontalScroll',
          JSON.stringify({
            oldValue: Math.round(scaledValue),
            newValue: Math.round(newScaledValue),
          })
        );
      } else {
        localStorage.setItem(
          'verticalScroll',
          JSON.stringify({
            oldValue: Math.round(scaledValue),
            newValue: Math.round(newScaledValue),
          })
        );
      }

      const exists = Event && Event.some((item) => item[0] === 'Scroll');
      if (!exists) return;

      socket.send(
        JSON.stringify({
          Event: {
            EventName: 'Scroll',
            ID: data?.ID,
            Info: [1, Math.round(newScaledValue)],
          },
        })
      );
    }
  };

  const decrementScale = () => {
    const newScaledValue = scaledValue - 1;
    if (newScaledValue >= 1) {
      setScaledValue(newScaledValue);
      console.log(
        JSON.stringify({
          Event: {
            EventName: emitEvent && emitEvent[0],
            ID: data?.ID,
            Info: [-1, Math.round(newScaledValue)],
          },
        })
      );

      localStorage.setItem(
        data.ID,
        JSON.stringify({
          Event: {
            EventName: emitEvent && emitEvent[0],
            ID: data?.ID,
            Info: [-1, Math.round(newScaledValue)],
          },
        })
      );

      if (isHorizontal) {
        localStorage.setItem(
          'horizontalScroll',
          JSON.stringify({
            oldValue: Math.round(scaledValue),
            newValue: Math.round(newScaledValue),
          })
        );
      } else {
        localStorage.setItem(
          'verticalScroll',
          JSON.stringify({
            oldValue: Math.round(scaledValue),
            newValue: Math.round(newScaledValue),
          })
        );
      }
      const exists = Event && Event.some((item) => item[0] === 'Scroll');
      if (!exists) return;

      socket.send(
        JSON.stringify({
          Event: {
            EventName: 'Scroll',
            ID: data?.ID,
            Info: [-1, Math.round(newScaledValue)],
          },
        })
      );
    }
  };

  useEffect(() => {
    if (isHorizontal) {
      localStorage.setItem(
        'horizontalScroll',
        JSON.stringify({ oldValue: Thumb || 1, newValue: Thumb || 1 })
      );
    } else {
      localStorage.setItem(
        'verticalScroll',
        JSON.stringify({ oldValue: Thumb || 1, newValue: Thumb || 1 })
      );
    }
  }, []);

  
  // useEffect(() => {
  //   if (isEdgeCell(row, column)) {
  //     if (selectedKey === 'ArrowRight' && isHorizontal && column === 10) {
  //       console.log("moved horizontally right")
  //       // If moving horizontally right and at the last column
  //       setScaledValue((prevValue) => Math.min(prevValue + 1, maxValue));
  //     } else if (selectedKey === 'ArrowLeft' && isHorizontal && column === 1) {
  //       // console.log("moved horizontally left")
  //       // If moving horizontally left and at the first column
  //       setScaledValue((prevValue) => Math.max(prevValue - 1, 1));
  //     } else if (selectedKey === 'ArrowDown' && !isHorizontal && row === 10) {
  //       // console.log("moved vertivally down")
  //       // If moving vertically down and at the last row
  //       setScaledValue((prevValue) => Math.min(prevValue + 1, maxValue));
  //     } else if (selectedKey === 'ArrowUp' && !isHorizontal && row === 1) {
  //       // console.log("moved vertically up")
  //       // If moving vertically up and at the first row
  //       setScaledValue((prevValue) => Math.max(prevValue - 1, 1));
  //     }
  //   }
  //   // console.log("moved", "Scale", scaledValue)
  // }, [row, column, isHorizontal, maxValue, selectedKey, Thumb]);

  useEffect(() => {
      setScaledValue((prevValue) => Math.min( Thumb, maxValue ));
    // console.log("moved", "Scale", scaledValue)
  }, [Thumb]);
  

  return (
    <div
      id={data?.ID}
      onMouseEnter={handleTrackMouseEnter}
      onMouseLeave={handleTrackMouseLeave}
      style={isHorizontal ? horizontalPosition : verticalPosition}
    >
      <div>
        {isHorizontal && showButtons ? (
          <>
            <div
              className='scroll-bar-icon scroll-bar-icon-horizontal icon-style'
              style={{ left: '0' }}
              onClick={decrementScale}
            >
              <FA.FaCaretDown style={{ position: 'absolute', top: '-1px', left: '-1px' }} />
            </div>
            <div
              className='scroll-bar-icon scroll-bar-icon-horizontal icon-style'
              style={{ right: '0' }}
              onClick={incrementScale}
            >
              <FA.FaCaretUp style={{ position: 'absolute', top: '-1px', left: '-1px' }} />
            </div>
          </>
        ) : showButtons ? (
          <>
            <>
              <div
                className='scroll-bar-icon scroll-bar-icon-vertical icon-style'
                style={{ top: '0' }}
                onClick={decrementScale}
              >
                <FA.FaCaretUp style={{ position: 'absolute', top: '-1px', left: '-1px' }} />
              </div>
              <div
                className='scroll-bar-icon scroll-bar-icon-vertical icon-style'
                style={{ bottom: '0' }}
                onClick={incrementScale}
              >
                <FA.FaCaretDown style={{ position: 'absolute', top: '-1px', left: '-1px' }} />
              </div>
            </>
          </>
        ) : null}
        <div
          className={`scroll-bar ${isHorizontal ? 'horizontal' : 'vertical'}`}
          style={{ ...trackStyle }}
          onMouseDown={handleThumbDrag}
          onClick={handleTrackClick}
          ref={trackRef}
        >
          <div className='thumb' style={{ ...thumbStyle }} ref={thumbRef}></div>
        </div>
      </div>
    </div>
  );
};

export default ScrollBar;
