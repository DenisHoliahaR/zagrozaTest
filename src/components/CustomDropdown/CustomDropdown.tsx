import React, { FC, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import './custom-dropdown.scss';
import arrow from './../../images/arrow.svg';

interface IDropdownProps {
    options?: IOption[];
    openMethod?: 'hover' | 'click';
    onSearch?: (searchValue: string) => Promise<IOption[]> | undefined;
    withSearch?: boolean;
    withAdd?: boolean;
}

interface IOption {
    text: string;
    handler?: Function;
    value?: any;
    icon?: string;
}

const defaultOptions: IOption[] = [
    {
        text: 'option 1',
        value: 'option1'
    },
    {
        text: 'option 2',
        value: 'option2',
        // icon: arrow,
    },
    {
        text: 'option 3',
        value: 'option3'
    },
];

const CustomDropdown: FC<IDropdownProps> = ({ options = defaultOptions, openMethod = 'click', onSearch, withAdd = true, withSearch = true }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<IOption[]>(options);
    const [selectedValue, setSelectedValue] = useState<IOption | undefined>();
    const [newOptionName, setNewOptionName] = useState<string | undefined>(); 

    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (value: boolean) => {
        setIsOpen(value);
    };

    useEffect(() => {
        if (dropdownRef.current && isOpen) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                toggleDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (searchValue) {
            if (onSearch) {
                const searchOptions = async () => {
                    const result = await onSearch(searchValue);
                    if (result) setFilteredOptions(result);
                }
                searchOptions();
            } else {
                setFilteredOptions(options.filter(option => option.text.toLowerCase().includes(searchValue.toLowerCase())))
            }
        } else {
            setFilteredOptions(options);
        }
    }, [searchValue])

    const createNewOption = (name: string | undefined) => {
        
    }

    return (
        <div 
            className={`dropdown ${isOpen ? 'open' : ''}`} 
            ref={dropdownRef}
            onMouseOver={openMethod === 'hover' ? () => toggleDropdown(true) : undefined}
            onMouseOut={openMethod === 'hover' ? () => toggleDropdown(false) : undefined}
        >
            <div
                className="select"
                onClick={openMethod === 'click' ? () => toggleDropdown(!isOpen) : undefined}
            >
                {selectedValue ? 
                    <h3 className="selected black">{selectedValue.text}</h3>
                    :
                    <h3 className="selected">Оберіть ваше місто</h3>
                }
                <img src={arrow} alt="Dropdown arrow" className="arrow" />
            </div>
            {isOpen &&
                ReactDOM.createPortal(
                    <div
                        className="menu"
                        style={{
                            top: position.top,
                            left: position.left,
                            width: dropdownRef.current?.clientWidth,
                        }}
                        ref={menuRef}
                    >
                        {withSearch && 
                            <div className="search">
                                <input
                                    type="text"
                                    placeholder="Пошук..."
                                    value={searchValue}
                                    onChange={(event) => setSearchValue(event.target.value)}
                                />
                            </div>
                        }
                        <ul className={`${!withAdd ? 'radius': ''}`}>
                            {filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className="option"
                                    onClick={option.handler ? option.handler() : () => setSelectedValue(option)}
                                >
                                    {option.text}
                                    {option.icon && <img src={option.icon} alt='Option image' />}
                                </li>
                            ))}
                        </ul>
                        {withAdd && 
                            <div className="createNew">
                                <input type="text" placeholder='Назва нової опції' value={newOptionName} onChange={(e) => setNewOptionName(e.target.value)} />
                                <button onClick={() => createNewOption(newOptionName)}>create new option</button>
                            </div>
                        }
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default CustomDropdown;

