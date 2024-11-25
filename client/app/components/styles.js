"use client";
import styled, { keyframes } from "styled-components";

export const slideIn = keyframes`
    0%{
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    }
    100%{
    -webkit-transform: scale(1);
    transform: scale(1);
    }
`;

export const Container = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  width: 300px;
  margin: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;
