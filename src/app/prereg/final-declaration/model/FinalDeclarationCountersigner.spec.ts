describe('Final Declaration Countersigner', () => {
    let data ={
        forenames:'fore name test',
        surname:'surname test',
        town:'town test',
        decisionMadeAt:'decision made at',
        decision:'decision test',
        feedback:'feedback test',
        learningContractResponse:'learning contract response test',
        eligibleAsTutor:'eligible as tutor test',
        countersignerId:'countersigner id test',
        id:'id test',
        countersignerComment:'countersigner comment test',
        countersignerCommentId: 'countersigner comment id test'
    }
    
  it('should init correctly', () => {
      expect(data).toBeTruthy();
  });
  
  describe('countersigner comment', () => {
    let commentData={
        traineeProgressComments:'traineeprogresscomments test',
        anyProgressEffected:'any progress effected test',
        annualLeaves:'annual leaves test',
        sickLeaves:'sick leaves test',
        otherLeaves:'other leaves test',
        otherLeaveDetails:'other leave details test',
        commentsByTutor:'comment by tutor test',
        traineeFeedbackOnTutorAssessment:' trainee feedback on tutor assessment test'        
    }
    it('should init correctly', () => {
        expect(commentData).toBeTruthy();
    });
  });
  
})

