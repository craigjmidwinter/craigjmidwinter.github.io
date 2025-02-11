import React from 'react';
import styled from "styled-components";
import Image from "next/image";

const BannerContainer = styled.div`
    background-color: black;
    color: white;
    text-align: center;
    padding: 10px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: row;
       justify-content: center;
    > img {
        padding: 10px;
        
`
export default function Construction() {
    return (
        <BannerContainer>
            <Image src="/construct.gif" alt="construction sign" width="50" height="50"/>
            <Image src="/construct-text.gif" alt="Under Construction"/>
            <Image src="/construct.gif" alt="construction sign" width="50" height="50"/>
        </BannerContainer>
    )
}