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
  background: linear-gradient(145deg, #1f2937, #374151);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 320px;
  margin: 0;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
  }
`;
