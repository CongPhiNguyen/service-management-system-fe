import { PlusOutlined } from "@ant-design/icons";
import { Tag, AutoComplete } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import React, { useEffect, useRef, useState } from "react";
import RemoveAccents from "../../../helper/RemoveAccents";
import { get } from "../../../api/axios";
import URL from "../../../api/config";

const InputDependency = (props) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const [listService, setListService] = useState([]);
  useEffect(() => {
    console.log(props.service);
    const getAllService = async () => {
      get(URL.URL_GET_ALL_SERVICE)
        .then((res) => {
          let arr = res.data.services.map((name) => name.serviceName);
          arr = arr.filter((name) => name !== props.service.serviceName);
          setListService(arr);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getAllService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (removedTag) => {
    const newTags = props.serviceDependencies.filter(
      (tag) => tag !== removedTag
    );
    props.setServiceDependencies(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (data) => {
    setInputValue(data);
  };

  // const handleInputConfirm = () => {
  //   if (inputValue && props.serviceDependencies.indexOf(inputValue) === -1) {
  //     const arr = [...props.serviceDependencies, inputValue];
  //     props.setServiceDependencies(arr);
  //   }
  //   setInputVisible(false);
  //   setInputValue("");
  // };

  const [options, setOptions] = useState([]);

  const onSearch = (searchText) => {
    let results = [];
    listService.forEach((value) => {
      if (RemoveAccents(value).includes(RemoveAccents(searchText))) {
        results.push({
          value,
        });
      }
    });
    setOptions(!searchText ? [] : results);
  };

  const onSelect = (data) => {
    if (data && props.serviceDependencies.indexOf(data) === -1) {
      const arr = [...props.serviceDependencies, data];
      props.setServiceDependencies(arr);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: "from",
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              e.target.style = "display: inline-block";
            }
          }}
          leave={{
            opacity: 0,
            width: 0,
            scale: 0,
            duration: 200,
          }}
          appear={false}
        >
          {props.serviceDependencies.map((tag, index) => {
            return (
              <Tag
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleClose(tag);
                }}
              >
                {tag}
              </Tag>
            );
          })}
        </TweenOneGroup>
      </div>
      {inputVisible && (
        <>
          <AutoComplete
            ref={inputRef}
            type="text"
            options={options}
            style={{ width: 200 }}
            onSelect={onSelect}
            size="small"
            value={inputValue}
            onSearch={onSearch}
            placeholder="input here"
            onChange={handleInputChange}
          />
        </>
      )}
      {!inputVisible && (
        <Tag onClick={showInput} className="border-dashed bg-[#fff] ">
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

export default InputDependency;
