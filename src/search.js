// GET - Shop Product Page | - Displaying demanded product page with page numbers
app.get('/message/:page', async (req, res, next) => {

    // Declaring variable
    const resPerPage = 5; // results per page
    const page = req.params.page || 1; // Page 
    try {
     if (req.query.category) {
    // Declaring query based/search variables
       const categoryQuery = req.query.category,
    // Find Demanded Products - Skipping page values, limit results       per page
    const foundMsg = await Messages.find({categories: categoryQuery})
          .skip((resPerPage * page) - resPerPage)
          .limit(resPerPage);
    // Count how many products were found
    const numOfProducts = await Messages.count({categories: categoryQuery});
    // Renders The Page

    res.render('messages.ejs', {
       Message: foundMsg,
       currentPage: page, 
       pages: Math.ceil(numOfProducts / resPerPage), 
      });
     }
    } catch (err) {
      throw new Error(err);
    }
    });