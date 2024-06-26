import { Flex, Icon, ModalFooter, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, useToast, Box, Text} from "@chakra-ui/react";

import React, { useEffect, useState } from 'react'
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./ShowAreaInfo.module";
import CustomInput from "../../CustomInputs/CustomInput";
import { softBlue, white } from "@/utils/colors";
import { URL } from '@/utils/consts'
import post from '@/utils/post'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
import CustomSelect from "@/components/CustomInputs/CustomSelect";
import { regular12 } from "@/styles/fonts";


export default function ShowAreaInfo({ isOpen, onClose, modalMode, document = {} }) {
    const toast = useToast()

    const defaultData = {
        value: "",
        label: '',
        nextId: '',
        isClass: false,
    }

    const { data: areas, isLoading: isProjectLoading, mutate } = useSWR(
        `${URL}/getAreas?name=${''}`,
        fetcher,
    )

    const [areasOptions, setAreasOptions] = useState({})
    
    const updateAreasOptions = () => {
        const obj = {};

        for (const item of areas) {
        obj[item._id] = item.label;
        }

        setAreasOptions(obj)
    }

    const viewMode = {
        edit: {
            header: "EDITAR",
        },
        view: {
            header: "VER",
        },
        add: {
            header: "AÑADIR"
        }
    }

    const [mode, setMode] = useState(modalMode)
    const [data, setData] = useState(defaultData)

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (mode === 'add') {
            const response = await post(`${URL}/addArea`, data)
            if (response.status === 'success') {
                toast({
                    title: 'Curso / Area agregado.',
                    description: `El Curso / Area "${data.label}" se ha agregado exitosamente al sistema.`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    })
                const backup = [...areas]
                backup.unshift(response.data)
                mutate(backup, false)
                setData(defaultData)
                onClose()
            } else {
                toast({
                    title: 'Error',
                    description: `${response.msg}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    })
            }
        }
        if (mode === 'edit') {
            const response = await post(`${URL}/editArea`, data)
            if (response.status === 'success') {
                toast({
                    title: 'Curso / Area editado.',
                    description: `El Curso / Area "${data.label}" se ha editado exitosamente en el sistema.`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    })
                const backup = []
                areas.forEach((element) => {
                    if(element._id === data._id)
                    {
                        backup.push(response.data)
                    } else {
                        backup.push(element)
                    }
                })
                mutate(backup,false)
                setData(defaultData)
                onClose()
            } else {
                toast({
                    title: 'Error',
                    description: `${response.msg}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    })
            }
            
        }
    }

    const handleInputChange = (event) => {
        if (mode !== "view") {
            setData({
                ...data,
                [event.target.name]: event.target.value,
            })
        }
    }

    useEffect(()=> {
        updateAreasOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[areas])

    useEffect(()=> {
        if(!isOpen) {
            setMode(modalMode)
            setData(defaultData)
        } else {
            setMode(modalMode)
            if(document._id) {
                setData({
                    ...document,
                })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isOpen])

    return(
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{viewMode[mode].header} AREA / CURSO</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
          <ModalBody>
            <Flex sx={styles.MainContainer}>
                <Flex w='1254px' flexDirection='column' ml='5' mr='5'>
                    <Flex flexDirection='row' mt='3'>
                            <Flex flexDirection='column'>
                                <Flex flexDirection='column' mb='30' >
                                    <Flex flexDirection='column' w='400px'>
                                        <FormControl isRequired>
                                            <CustomInput
                                                label='NOMBRE DE CURSO / AREA'
                                                value={data.label}
                                                name='label'
                                                height='47'
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Flex>
                                    <Flex h="30px"/>
                                    <Flex flexDirection='column' w='400px'>
                                        <FormControl isRequired>
                                            <CustomSelect
                                                label='CURSO / AREA SIGUIENTE'
                                                name="nextId"
                                                value={areasOptions[data.nextId]}
                                                options={isProjectLoading ? ([{label: 'default', value: 'Ninguno', _id: ''}]) : (areas)}
                                                onChange={(value, name) =>
                                                handleInputChange({
                                                target: {
                                                    name: name,
                                                    value: value,
                                                },
                                                })
                                                }
                                            />
                                        </FormControl>
                                    </Flex>
                                    <Flex h="30px"/>
                                    <Flex flexDirection='column' w='400px'>
                                        <Flex onClick={() => handleInputChange({
                                            target: {
                                                name: 'isClass',
                                                value: !data.isClass,
                                            }
                                        })}>
                                            <Box w='25px' h='25px' borderWidth='1px' borderColor={softBlue} mr="4" bgColor={data.isClass === true ? (softBlue) : ('')}/>
                                            <Text sx={regular12}>ES SALÓN DE CLASES</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                    </Flex>
                </Flex>
            </Flex>
          </ModalBody>
        <ModalFooter>
        {mode !== "view" &&
            <Button
            sx={styles.Button}
            bg='#FF2B91'
            color={white}
            leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                    <HiOutlineDocumentAdd />
                </Icon>
                }
            type="submit"
            >
                {mode === "add" && 'AÑADIR'}
                {mode === "edit" && 'APLICAR'}
            </Button>
        }
        </ModalFooter>
        </form>
        </ModalContent>
      </Modal>
    )
}