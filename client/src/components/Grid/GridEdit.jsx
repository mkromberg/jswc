import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { useAppData } from '../../hooks';
import { calculateDateAfterDays, getObjectById, calculateDaysFromDate } from '../../utils';
import dayjs from 'dayjs';

const GridEdit = ({ data }) => {
  const inputRef = useRef(null);
  const dateRef = useRef(null);
  const [isEditable, setIsEditable] = useState(false);

  const [dateFormattedValue, setDateFormattedValue] = useState(data?.value);

  const { FieldType, Decimal } = data?.typeObj?.Properties;
  const { dataRef, findDesiredData, handleData, socket } = useAppData();
  const dateFormat = JSON.parse(getObjectById(dataRef.current, 'Locale'));
  const { ShortDate, Thousand, Decimal: decimalSeparator } = dateFormat?.Properties;
  const [inputValue, setInputValue] = useState(
    FieldType == 'Date'
      ? dayjs(calculateDateAfterDays(data?.value)).format(ShortDate && ShortDate)
      : data?.value
  );
  const [selectedDate, setSelectedDate] = useState(
    FieldType == 'Date' ? dayjs(calculateDateAfterDays(data?.value)) : new Date()
  );

  const triggerCellChangedEvent = () => {
    // const gridEvent = findDesiredData(data?.gridId);

    const values = data?.gridValues;

    values[data?.row - 1][data?.column] = FieldType == 'Date' ? dateFormattedValue : inputValue;
    // handleData(
    //   {
    //     ID: data?.gridId,
    //     Properties: {
    //       ...gridEvent.Properties,
    //       Values: values,
    //       CurCell: [data?.row, data?.column + 1],
    //     },
    //   },
    //   'WS'
    // );

    const cellChangedEvent = JSON.stringify({
      Event: {
        EventName: 'CellChanged',
        ID: data?.gridId,
        Row: data?.row,
        Col: data?.column + 1,
        Value: FieldType == 'Date' ? dateFormattedValue : inputValue,
      },
    });
    const updatedGridValues = JSON.stringify({
      Event: {
        EventName: 'CellChanged',
        Values: values,
        CurCell: [data?.row, data?.column + 1],
      },
    });

    const formatCellEvent = JSON.stringify({
      FormatCell: {
        Cell: [data?.row, data?.column + 1],
        ID: data?.gridId,
        Value: FieldType == 'Date' ? dateFormattedValue : inputValue,
      },
    });

    localStorage.setItem(data?.gridId, updatedGridValues);

    // localStorage.setItem(data?.gridId, cellChangedEvent);
    const exists = data?.gridEvent && data?.gridEvent.some((item) => item[0] === 'CellChanged');
    if (!exists) return;
    console.log(cellChangedEvent);
    socket.send(cellChangedEvent);
    localStorage.setItem(
      'isChanged',
      JSON.stringify({
        isChange: true,
        value: FieldType == 'Date' ? dateFormattedValue : inputValue,
      })
    );
    if (!data?.formatString) return;

    console.log(formatCellEvent);
    socket.send(formatCellEvent);
  };

  useEffect(() => {
    if (data.focused) {
      inputRef?.current?.focus();
    }
  }, [data.focused]);

  useEffect(() => {
    return () => console.log('unmount');
  }, []);

  const handleEditEvents = () => {
    if (FieldType == 'Date') {
      if (data?.value == dateFormattedValue) return;
      triggerCellChangedEvent();
    } else {
      if (data?.value == inputValue) return;
      triggerCellChangedEvent();
    }
  };

  const handleKeyPress = (e) => {
    const isAltPressed = e?.altKey ? 4 : 0;
    const isCtrlPressed = e?.ctrlKey ? 2 : 0;
    const isShiftPressed = e?.shiftKey ? 1 : 0;
    const charCode = e?.key?.charCodeAt(0);
    let shiftState = isAltPressed + isCtrlPressed + isShiftPressed;

    const exists = data?.typeObj?.Properties?.Event?.some((item) => item[0] === 'KeyPress');
    if (!exists) return;

    console.log(
      JSON.stringify({
        Event: {
          EventName: 'KeyPress',
          ID: data?.typeObj?.ID,
          Info: [e.key, charCode, e.keyCode, shiftState],
        },
      })
    );

    socket.send(
      JSON.stringify({
        Event: {
          EventName: 'KeyPress',
          ID: data?.typeObj?.ID,
          Info: [e.key, charCode, e.keyCode, shiftState],
        },
      })
    );
  };

  if (FieldType == 'Date') {
    const handleTextClick = () => {
      inputRef.current.select();
      inputRef.current.showPicker();
    };
    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
      const selectedDate = dayjs(event.target.value).format(ShortDate);
      let value = calculateDaysFromDate(event.target.value) + 1;
      setInputValue(selectedDate);
      setDateFormattedValue(value);
    };
    return (
      <>
        {!isEditable ? (
          <div
            onDoubleClick={() => {
              setIsEditable(true);
            }}
            style={{ backgroundColor: data?.backgroundColor, outline: 0, paddingLeft: '5px' }}
          >
            {!data?.formattedValue ? inputValue : data?.formattedValue}
          </div>
        ) : (
          <>
            <input
              ref={dateRef}
              id={`${data?.typeObj?.ID}.r${data?.row + 1}.c${data?.column + 1}`}
              style={{
                border: 0,
                outline: 0,
                width: '100%',
                height: '100%',
                paddingLeft: '5px',
              }}
              value={inputValue}
              type='text'
              readOnly
              onClick={(e) => {
                e.stopPropagation();
                handleTextClick();
              }}
              onBlur={() => {
                setIsEditable(false);
                handleEditEvents();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
            <input
              id={`${data?.typeObj?.ID}.r${data?.row + 1}.c${data?.column + 1}`}
              type='date'
              value={selectedDate}
              ref={inputRef}
              onChange={handleDateChange}
              style={{
                display: 'none',
              }}
            />
          </>
        )}
      </>
    );
  }

  if (FieldType == 'LongNumeric' || FieldType == 'Numeric') {
    return (
      <>
        {!isEditable ? (
          <div
            onDoubleClick={() => {
              setIsEditable(true);
            }}
            style={{
              backgroundColor: data?.backgroundColor,
              outline: 0,
              textAlign: 'right',
              paddingRight: '5px',
            }}
          >
            {!data?.formattedValue ? (
              <NumericFormat
                className='currency'
                allowLeadingZeros={true}
                id={`${data?.typeObj?.ID}.r${data?.row + 1}.c${data?.column + 1}`}
                style={{
                  width: '100%',
                  border: 0,
                  outline: 0,
                  backgroundColor: data?.backgroundColor,
                  textAlign: 'right',
                  paddingRight: '5px',
                }}
                readOnly
                decimalScale={Decimal}
                value={data?.value}
                decimalSeparator={decimalSeparator}
                thousandSeparator={Thousand}
              />
            ) : (
              data?.formattedValue
            )}
          </div>
        ) : (
          <NumericFormat
            className='currency'
            allowLeadingZeros={true}
            getInputRef={inputRef}
            id={`${data?.typeObj?.ID}.r${data?.row + 1}.c${data?.column + 1}`}
            style={{
              width: '100%',
              border: 0,
              outline: 0,
              backgroundColor: data?.backgroundColor,
              textAlign: 'right',
              paddingRight: '5px',
            }}
            onValueChange={(value) => {
              if (!value.value) return setInputValue(0);
              setInputValue(parseFloat(value?.value));
            }}
            decimalScale={Decimal}
            value={inputValue}
            decimalSeparator={decimalSeparator}
            thousandSeparator={Thousand}
            onBlur={(e) => {
              setIsEditable(false);
              handleEditEvents();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              handleKeyPress(e);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      {!isEditable ? (
        <div
          onDoubleClick={() => {
            setIsEditable(true);
          }}
          autoFocus
          onKeyDown={(e) => console.log({ e })}
          // onDoubleClick={() => setShowInput(true)}
          style={{
            backgroundColor: data?.backgroundColor,
            outline: 0,
            height: '100%',
            width: '100%',
            paddingLeft: '5px',
          }}
        >
          {!data?.formattedValue ? data?.value : data?.formattedValue}
        </div>
      ) : (
        <input
          type='text'
          id={`${data?.typeObj?.ID}.r${data?.row + 1}.c${data?.column + 1}`}
          style={{
            outline: 0,
            border: 0,
            width: '100%',
            height: '100%',
            backgroundColor: data?.backgroundColor,
            paddingLeft: '5px',
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            // setIsEditable(true);
          }}
          value={inputValue}
          onKeyDown={(e) => {
            e.stopPropagation();
            handleKeyPress(e);
          }}
          onChange={(e) => {
            e.stopPropagation();
            setInputValue(e.target.value);
          }}
          onBlur={(e) => {
            setIsEditable(false);
            handleEditEvents();
          }}
          autoFocus
        />
      )}
    </>
  );
};

export default GridEdit;
