import { PlusOutlined } from '@ant-design/icons';
import { Tag, AutoComplete } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import React, { useEffect, useRef, useState } from 'react';
import RemoveAccents from '../../../helper/RemoveAccents';

const InputDependency = (props) => {
    const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3']);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        if (props.serviceDependencies)
            setTags(props.serviceDependencies)
        console.log(props.serviceDependencies);
    }, [props.serviceDependencies]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (data) => {
        setInputValue(data);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            const arr = [...tags, inputValue]
            console.log(arr)
            setTags(arr)
            props.setServiceDependencies(arr)
        }
        setInputVisible(false);
        setInputValue('');
    };

    const [options, setOptions] = useState([]);
    const listService = [
        "Login",
        "Register",
        "Load album",
        "LoUpload albumgin"
    ]
    const onSearch = (searchText) => {
        console.log(searchText)
        let results = []
        listService.forEach(value => {
            if (RemoveAccents(value).includes(RemoveAccents(searchText))) {
                results.push({
                    value
                })
            }
        })
        setOptions(
            !searchText ? [] : results,
        );
    };

    const onSelect = (data) => {
        if (data && tags.indexOf(data) === -1) {
            const arr = [...tags, data]
            setTags(arr)
            props.setServiceDependencies(arr)
        }
        setInputVisible(false);
        setInputValue('');
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
                        type: 'from',
                        duration: 100,
                    }}
                    onEnd={(e) => {
                        if (e.type === 'appear' || e.type === 'enter') {
                            e.target.style = 'display: inline-block';
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
                    {
                        tags.map((tag, index) => {
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
                            )
                        })
                    }
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
                        onBlur={handleInputConfirm}
                    // onPressEnter={handleInputConfirm}
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