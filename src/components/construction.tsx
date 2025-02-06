// under construction banner
import React from 'react';
import styled from "styled-components";
import Image from "next/image";

//fixed banner along the top of the page full width black

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
            <img src="/construct.gif" alt="construction sign" width="50" height="50" />
            <img src="/construct-text.gif" alt="Under Construction" />
            <img src="/construct.gif" alt="construction sign" width="50" height="50" />
        </BannerContainer>
    )
}